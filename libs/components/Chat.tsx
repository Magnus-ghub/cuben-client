import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { socketVar, userVar, chatOpenVar } from '../../libs/apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';

interface MessagePayload {
	event: string;
	text: string;
	memberData: CustomJwtPayload;
	createdAt?: string;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: CustomJwtPayload;
	action: string;
}

/**
 * Custom SVG Logo Component for Chat
 */
const CubenChatLogo: React.FC = () => (
	<svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="chatCubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style={{ stopColor: '#5DDBF4', stopOpacity: 1 }} />
				<stop offset="50%" style={{ stopColor: '#7B9FF5', stopOpacity: 1 }} />
				<stop offset="100%" style={{ stopColor: '#9B7FED', stopOpacity: 1 }} />
			</linearGradient>
		</defs>
		<path
			d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z"
			fill="none"
			stroke="url(#chatCubeGradient)"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path d="M 50 15 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
		<path d="M 15 35 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
		<path d="M 85 35 L 50 50" stroke="url(#chatCubeGradient)" strokeWidth="8" strokeLinecap="round" />
	</svg>
);

const Chat = () => {
	/** REFS **/
	const chatContentRef = useRef<HTMLDivElement>(null);
	const textInput = useRef<HTMLInputElement>(null);
	const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	/** STATE MANAGEMENT **/
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

	/** APOLLO REACTIVE VARIABLES **/
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const open = useReactiveVar(chatOpenVar);

	/** UTILITY FUNCTIONS **/
	
	/**
	 * Format message timestamp to relative time
	 * @param timestamp - ISO string timestamp
	 * @returns Formatted time string (e.g., "Just now", "5m ago", "2h ago")
	 */
	const formatMessageTime = (timestamp?: string): string => {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
		return date.toLocaleDateString();
	};

	/**
	 * Check if WebSocket connection is ready
	 * @returns true if connected, false otherwise
	 */
	const checkSocketConnection = (): boolean => {
		if (!socket) {
			console.error('❌ WebSocket not initialized');
			sweetErrorAlert('WebSocket connection not established');
			return false;
		}
		if (socket.readyState !== WebSocket.OPEN) {
			console.error('❌ WebSocket not ready. ReadyState:', socket.readyState);
			sweetErrorAlert('Connection is not ready. Please wait...');
			return false;
		}
		return true;
	};

	/**
	 * Check if user is authenticated
	 * @returns true if authenticated, false otherwise
	 */
	const checkUserAuthentication = (): boolean => {
		if (!user || !user._id) {
			console.error('❌ User not authenticated');
			sweetErrorAlert('Please login to send messages');
			return false;
		}
		return true;
	};

	/** WEBSOCKET EVENT HANDLERS **/

	/**
	 * Handle incoming WebSocket messages
	 */
	const handleWebSocketMessage = useCallback(
		(msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);
				console.log('📩 WebSocket message received:', data);

				switch (data.event) {
					case 'info':
						console.log('ℹ️ Info event:', data);
						const newInfo: InfoPayload = data;
						setOnlineUsers(newInfo.totalClients);
						setIsConnected(true);
						setReconnectAttempt(0);
						setIsLoading(false);
						break;

					case 'getMessages':
						console.log('📝 Messages list received:', data.list?.length || 0);
						const list: MessagePayload[] = data.list || [];
						setMessagesList(list);
						setIsLoading(false);
						break;

					case 'message':
						console.log('💬 New message received:', data);
						const newMessage: MessagePayload = data;
						setMessagesList((prev) => [...prev, newMessage]);
						setIsSending(false);

						// Clear message timeout
						if (messageTimeoutRef.current) {
							clearTimeout(messageTimeoutRef.current);
							messageTimeoutRef.current = null;
						}
						break;

					default:
						console.warn('⚠️ Unknown event:', data.event);
				}
			} catch (error) {
				console.error('❌ Error parsing WebSocket message:', error);
				sweetErrorAlert('Failed to process message');
			}
		},
		[],
	);

	/**
	 * Handle WebSocket connection open
	 */
	const handleWebSocketOpen = useCallback(() => {
		console.log('✅ WebSocket connection opened');
		setIsConnected(true);
		setReconnectAttempt(0);
		setIsLoading(false);

		// Request initial messages
		if (socket && socket.readyState === WebSocket.OPEN) {
			console.log('📤 Requesting initial messages...');
			socket.send(
				JSON.stringify({
					event: 'getMessages',
				}),
			);
		}
	}, [socket]);

	/**
	 * Handle WebSocket errors
	 */
	const handleWebSocketError = useCallback((error: Event) => {
		console.error('❌ WebSocket error:', error);
		setIsConnected(false);
		setIsLoading(false);
		// Don't show alert on every error - only log
	}, []);

	/**
	 * Handle WebSocket connection close
	 */
	const handleWebSocketClose = useCallback(
		(event: CloseEvent) => {
			console.log('⚠️ WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
			setIsConnected(false);
			setIsLoading(false);

			// Auto-reconnect if chat is still open and haven't exceeded max attempts
			if (open && reconnectAttempt < 5) {
				const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
				console.log(
					`🔄 Attempting to reconnect in ${timeout}ms... (Attempt ${reconnectAttempt + 1}/5)`,
				);

				reconnectTimeoutRef.current = setTimeout(() => {
					setReconnectAttempt((prev) => prev + 1);
					// Trigger reconnection - this should be handled in _app.tsx
				}, timeout);
			} else if (reconnectAttempt >= 5) {
				console.error('❌ Max reconnection attempts reached');
				sweetErrorAlert('Connection lost. Please refresh the page.');
			}
		},
		[reconnectAttempt, open],
	);

	/** LIFECYCLE EFFECTS **/

	/**
	 * Set up WebSocket event listeners
	 */
	useEffect(() => {
		console.log('🔌 Chat component mounted/updated. Socket:', !!socket, 'Open:', open);

		if (!socket) {
			console.error('❌ No socket available');
			setIsConnected(false);
			setIsLoading(false);
			return;
		}

		// Set up event listeners
		socket.onopen = handleWebSocketOpen;
		socket.onmessage = handleWebSocketMessage;
		socket.onerror = handleWebSocketError;
		socket.onclose = handleWebSocketClose;

		// Check current state
		if (socket.readyState === WebSocket.OPEN) {
			console.log('✅ Socket already open');
			handleWebSocketOpen();
		} else if (socket.readyState === WebSocket.CONNECTING) {
			console.log('🔄 Socket connecting...');
			setIsLoading(true);
		} else {
			console.error('❌ Socket in unexpected state:', socket.readyState);
			setIsConnected(false);
			setIsLoading(false);
		}

		// Cleanup function
		return () => {
			console.log('🧹 Cleaning up chat component');
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (messageTimeoutRef.current) {
				clearTimeout(messageTimeoutRef.current);
			}
		};
	}, [socket, handleWebSocketOpen, handleWebSocketMessage, handleWebSocketError, handleWebSocketClose]);

	/**
	 * Auto-scroll to bottom on new messages
	 */
	useEffect(() => {
		if (chatContentRef.current && messagesList.length > 0) {
			const scrollElement = chatContentRef.current;
			// Smooth scroll to bottom with delay for rendering
			setTimeout(() => {
				scrollElement.scrollTop = scrollElement.scrollHeight;
			}, 100);
		}
	}, [messagesList]);

	/**
	 * Focus input when chat opens and is connected
	 */
	useEffect(() => {
		if (open && textInput.current && isConnected) {
			setTimeout(() => {
				textInput.current?.focus();
			}, 100);
		}
	}, [open, isConnected]);

	/** USER INTERACTION HANDLERS **/

	/**
	 * Handle chat close button click
	 */
	const handleCloseChat = () => {
		console.log('🚪 Closing chat');
		chatOpenVar(false);
	};

	/**
	 * Handle input change
	 */
	const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageInput(e.target.value);
	}, []);

	/**
	 * Handle Enter key press to send message
	 */
	const getKeyHandler = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onClickHandler();
		}
	};

	/**
	 * Handle send button click
	 */
	const onClickHandler = () => {
		console.log('📤 Send button clicked');

		// Validation 1: Check if message is not empty
		const trimmedMessage = messageInput.trim();
		if (!trimmedMessage) {
			console.warn('⚠️ Empty message');
			sweetErrorAlert(Messages.error4 || 'Please enter a message');
			return;
		}

		// Validation 2: Check user authentication
		if (!checkUserAuthentication()) {
			return;
		}

		// Validation 3: Check socket connection
		if (!checkSocketConnection()) {
			return;
		}

		// Validation 4: Prevent duplicate sends
		if (isSending) {
			console.warn('⚠️ Already sending a message');
			return;
		}

		try {
			console.log('📨 Sending message:', trimmedMessage);
			setIsSending(true);

			// Prepare message payload with correct field names
			const messagePayload = {
				event: 'message',
				text: trimmedMessage,
				memberData: {
					_id: user._id,
					memberNick: user.memberNick,
					memberImage: user.memberImage,
					memberFullName: user.memberFullName,
				},
			};

			console.log('📦 Message payload:', messagePayload);
			socket.send(JSON.stringify(messagePayload));

			// Clear input immediately for better UX (optimistic update)
			setMessageInput('');

			// Set timeout to reset sending state if no response from server
			messageTimeoutRef.current = setTimeout(() => {
				console.warn('⚠️ Message send timeout - no server response');
				setIsSending(false);
				sweetErrorAlert('Message may not have been sent. Please try again.');
			}, 10000); // 10 second timeout
		} catch (error) {
			console.error('❌ Error sending message:', error);
			sweetErrorAlert('Failed to send message');
			setIsSending(false);
			// Restore message in input on error
			setMessageInput(trimmedMessage);
		}
	};

	/** RENDER **/

	// Don't render if chat is closed
	if (!open) return null;

	return (
		<Box className="modern-chat-container">
			<Stack className="modern-chat-frame">
				{/* ==================== HEADER ==================== */}
				<Box className="modern-chat-header">
					<Box className="header-left">
						<Box className="chat-logo-box">
							<CubenChatLogo />
						</Box>
						<Box className="chat-brand">
							<div className="chat-brand-name">cuben</div>
							<div className="chat-subtitle">Live Chat</div>
						</Box>
					</Box>

					<Box className="header-right">
						{/* Connection Status Badge */}
						{!isConnected ? (
							<Box className="offline-badge">
								<WifiOffIcon sx={{ fontSize: 16, mr: 0.5 }} />
								<span>Offline</span>
							</Box>
						) : (
							<Box className="online-badge">
								<Box className="online-dot" />
								<span>{onlineUsers} online</span>
							</Box>
						)}

						{/* Close Button */}
						<Box className="close-btn" onClick={handleCloseChat}>
							<CloseIcon sx={{ fontSize: 20 }} />
						</Box>
					</Box>
				</Box>

				{/* ==================== MESSAGES CONTENT ==================== */}
				<Box className="modern-chat-content" ref={chatContentRef}>
					{/* Loading State */}
					{isLoading ? (
						<Box className="chat-loading">
							<CircularProgress size={40} />
							<div>Connecting to chat...</div>
						</Box>
					) : !isConnected ? (
						/* Offline State */
						<Box className="chat-loading">
							<WifiOffIcon sx={{ fontSize: 48, color: '#999', mb: 2 }} />
							<div>Connection lost</div>
							<div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
								Attempting to reconnect... ({reconnectAttempt}/5)
							</div>
						</Box>
					) : (
						/* Messages List */
						<ScrollableFeed>
							<Stack className="messages-container">
								{/* Welcome Message */}
								<Box className="welcome-message">
									<Box className="welcome-icon">👋</Box>
									<Box>
										<div className="welcome-title">Welcome to Cuben Live Chat</div>
										<div className="welcome-text">Connect with other members in real-time</div>
									</Box>
								</Box>

								{/* No messages state */}
								{messagesList.length === 0 && !isLoading && (
									<Box className="no-messages">
										<div>No messages yet. Be the first to say hello! 💬</div>
									</Box>
								)}

								{/* Messages */}
								{messagesList.map((msg: MessagePayload, idx: number) => {
									const { text, memberData, createdAt } = msg;
									const memberImage = memberData?.memberImage
										? `${REACT_APP_API_URL}/${memberData.memberImage}`
										: '/img/profile/defaultUser.svg';
									const isOwnMessage = memberData?._id === user?._id;

									return (
										<Box
											key={idx}
											className={`message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'}`}
										>
											{/* Avatar - only for other users */}
											{!isOwnMessage && (
												<Avatar
													src={memberImage}
													alt={memberData?.memberNick || 'User'}
													sx={{ width: 32, height: 32 }}
												/>
											)}

											<Box className="message-content">
												{/* Author name - only for other users */}
												{!isOwnMessage && (
													<div className="message-author">{memberData?.memberNick || 'Anonymous'}</div>
												)}

												{/* Message bubble */}
												<Box className="message-bubble">
													<div className="message-text">{text}</div>
													{createdAt && (
														<div className="message-time">{formatMessageTime(createdAt)}</div>
													)}
												</Box>
											</Box>
										</Box>
									);
								})}

								{/* Sending indicator */}
								{isSending && (
									<Box className="message-wrapper own-message sending">
										<Box className="message-content">
											<Box className="message-bubble">
												<div className="sending-dots">
													<span></span>
													<span></span>
													<span></span>
												</div>
											</Box>
										</Box>
									</Box>
								)}
							</Stack>
						</ScrollableFeed>
					)}
				</Box>

				{/* ==================== INPUT AREA ==================== */}
				<Box className="modern-chat-input">
					{/* Connection Warning */}
					{!isConnected && (
						<Box className="connection-warning">
							<WifiOffIcon sx={{ fontSize: 16, mr: 0.5 }} />
							<span>
								Reconnecting... ({reconnectAttempt}/5)
							</span>
						</Box>
					)}

					{/* Authentication Warning */}
					{!user && (
						<Box className="auth-warning">Please login to send messages</Box>
					)}

					{/* Input Field and Send Button */}
					{isConnected && user && (
						<>
							<input
								ref={textInput}
								type="text"
								value={messageInput}
								className="chat-input-field"
								placeholder="Type a message..."
								onChange={getInputMessageHandler}
								onKeyDown={getKeyHandler}
								disabled={isSending || !isConnected}
							/>
							<button
								className={`chat-send-btn ${isSending ? 'sending' : ''}`}
								onClick={onClickHandler}
								disabled={isSending || !isConnected || !messageInput.trim()}
							>
								{isSending ? (
									<CircularProgress size={20} sx={{ color: '#fff' }} />
								) : (
									<SendIcon sx={{ fontSize: 20 }} />
								)}
							</button>
						</>
					)}
				</Box>
			</Stack>
		</Box>
	);
};

export default Chat;