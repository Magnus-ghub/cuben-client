import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from '../sweetAlert';
import { socketVar, userVar, chatOpenVar } from '../apollo/store';

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
  createdAt?: string;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

// Cuben Logo Component
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
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const textInput = useRef<HTMLInputElement>(null);
	const [messageInput, setMessageInput] = useState<string>('');
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const open = useReactiveVar(chatOpenVar);

	/** UTILITY FUNCTIONS **/
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

	const checkSocketConnection = (): boolean => {
		if (!socket) {
			sweetErrorAlert('WebSocket connection not established');
			return false;
		}
		if (socket.readyState !== WebSocket.OPEN) {
			sweetErrorAlert('Connection is not ready. Please wait...');
			return false;
		}
		return true;
	};

	const checkUserAuthentication = (): boolean => {
		if (!user || !user._id) {
			sweetErrorAlert('Please login to send messages');
			return false;
		}
		return true;
	};

	/** WEBSOCKET HANDLERS **/
	const handleWebSocketMessage = useCallback((msg: MessageEvent) => {
		try {
			const data = JSON.parse(msg.data);
			console.log('WebSocket message: ', data);

			switch(data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					setIsConnected(true);
					setReconnectAttempt(0);
					break;
					
				case 'getMessages':
					const list: MessagePayload[] = data.list || [];
					setMessagesList(list);
					setIsLoading(false);
					break;
					
				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList(prev => [...prev, newMessage]);
					setIsSending(false);
					break;
					
				default:
					console.log('Unknown event:', data.event);
			}
		} catch (error) {
			console.error('Error parsing WebSocket message:', error);
			sweetErrorAlert('Failed to process message');
		}
	}, []);

	const handleWebSocketError = useCallback((error: Event) => {
		console.error('WebSocket error:', error);
		setIsConnected(false);
		sweetErrorAlert('Connection error occurred');
	}, []);

	const handleWebSocketClose = useCallback(() => {
		console.log('WebSocket connection closed');
		setIsConnected(false);
		
		// Auto-reconnect logic
		if (reconnectAttempt < 5 && open) {
			const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
			console.log(`Attempting to reconnect in ${timeout}ms...`);
			
			reconnectTimeoutRef.current = setTimeout(() => {
				setReconnectAttempt(prev => prev + 1);
				// Trigger reconnection through parent component
				// This should be handled by your socket initialization logic
			}, timeout);
		}
	}, [reconnectAttempt, open]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!socket) {
			setIsConnected(false);
			setIsLoading(false);
			return;
		}

		// Set up WebSocket event listeners
		socket.onmessage = handleWebSocketMessage;
		socket.onerror = handleWebSocketError;
		socket.onclose = handleWebSocketClose;

		// Check if already connected
		if (socket.readyState === WebSocket.OPEN) {
			setIsConnected(true);
			setIsLoading(false);
		}

		// Cleanup function
		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			// Don't remove listeners as socket might be shared
			// Just clean up our local timers
		};
	}, [socket, handleWebSocketMessage, handleWebSocketError, handleWebSocketClose]);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		if (chatContentRef.current) {
			const scrollElement = chatContentRef.current;
			scrollElement.scrollTop = scrollElement.scrollHeight;
		}
	}, [messagesList]);

	// Focus input when chat opens
	useEffect(() => {
		if (open && textInput.current) {
			setTimeout(() => {
				textInput.current?.focus();
			}, 100);
		}
	}, [open]);

	/** HANDLERS **/
	const handleCloseChat = () => {
		chatOpenVar(false);
	};

	const getInputMessageHandler = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setMessageInput(e.target.value);
		},
		[],
	);

	const getKeyHandler = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onClickHandler();
		}
	};

	const onClickHandler = () => {
		// Validation checks
		if (!messageInput.trim()) {
			sweetErrorAlert(Messages.error4 || 'Please enter a message');
			return;
		}

		if (!checkUserAuthentication()) {
			return;
		}

		if (!checkSocketConnection()) {
			return;
		}

		if (isSending) {
			return; // Prevent double sending
		}

		// Send message
		try {
			setIsSending(true);
			socket.send(JSON.stringify({ 
				event: 'message', 
				data: messageInput.trim() 
			}));
			setMessageInput('');
			
			// Reset sending state after timeout if no response
			setTimeout(() => {
				setIsSending(false);
			}, 5000);
		} catch (error) {
			console.error('Error sending message:', error);
			sweetErrorAlert('Failed to send message');
			setIsSending(false);
		}
	};

	if (!open) return null;

	return (
		<Box className="modern-chat-container">
			<Stack className="modern-chat-frame">
				{/* Header */}
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
						<Box className="close-btn" onClick={handleCloseChat}>
							<CloseIcon sx={{ fontSize: 20 }} />
						</Box>
					</Box>
				</Box>

				{/* Messages Content */}
				<Box className="modern-chat-content" ref={chatContentRef}>
					{isLoading ? (
						<Box className="chat-loading">
							<CircularProgress size={40} />
							<div>Loading messages...</div>
						</Box>
					) : (
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
											{!isOwnMessage && (
												<Avatar 
													src={memberImage} 
													alt={memberData?.memberNick || 'User'}
													sx={{ width: 32, height: 32 }}
												/>
											)}
											<Box className="message-content">
												{!isOwnMessage && (
													<div className="message-author">
														{memberData?.memberNick || 'Anonymous'}
													</div>
												)}
												<Box className="message-bubble">
													<div className="message-text">{text}</div>
													{createdAt && (
														<div className="message-time">
															{formatMessageTime(createdAt)}
														</div>
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

				{/* Input Area */}
				<Box className="modern-chat-input">
					{!isConnected && (
						<Box className="connection-warning">
							<WifiOffIcon sx={{ fontSize: 16, mr: 0.5 }} />
							<span>Reconnecting...</span>
						</Box>
					)}
					{!user && (
						<Box className="auth-warning">
							Please login to send messages
						</Box>
					)}
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