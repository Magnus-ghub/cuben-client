import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { sweetErrorAlert } from '../../libs/sweetAlert';
import { socketVar, userVar, chatOpenVar } from '../../libs/apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { UnivoLogo } from './common/UnivoLogo';
import useDeviceDetect from '../hooks/useDeviceDetect';

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

const extractText = (data: any): string => {
	const raw =
		data?.text ??
		data?.message ??
		data?.msg ??
		data?.content ??
		data?.body ??
		data?.payload?.text ??
		data?.payload?.message ??
		data?.data?.text ??
		data?.data?.message ??
		'';

	return typeof raw === 'string' ? raw : String(raw || '');
};


const extractMemberData = (data: any): CustomJwtPayload =>
	data.memberData || data.author || data.user || data.sender || {};

const extractEventName = (data: any): string =>
	(data?.event || data?.type || data?.action || '').toString();

const formatMessageTime = (timestamp?: string): string => {
	if (!timestamp) return '';
	const date = new Date(timestamp);
	if (isNaN(date.getTime())) return '';
	const diff = Date.now() - date.getTime();
	const minutes = Math.floor(diff / 60000);

	if (minutes < 1) return 'Just now';
	if (minutes < 60) return `${minutes}m ago`;
	if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
	return date.toLocaleDateString();
};


const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const textInput = useRef<HTMLInputElement>(null);
	const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const initialLoadDoneRef = useRef<boolean>(false);

	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);

	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const open = useReactiveVar(chatOpenVar);
	const device = useDeviceDetect();

	const checkSocketConnection = (): boolean => {
		if (!socket) { sweetErrorAlert('WebSocket connection not established'); return false; }
		if (socket.readyState !== WebSocket.OPEN) { sweetErrorAlert('Connection is not ready. Please wait...'); return false; }
		return true;
	};

	const checkUserAuthentication = (): boolean => {
		if (!user?._id) { sweetErrorAlert('Please login to send messages'); return false; }
		return true;
	};

	const handleWebSocketMessage = useCallback((msg: MessageEvent) => {
		try {
			const data = JSON.parse(msg.data);
			const eventName = extractEventName(data);

			console.log('[Chat] 📩 RAW payload:', JSON.stringify(data, null, 2));

			switch (eventName) {
				case 'info': {
					setOnlineUsers((data as InfoPayload).totalClients);
					setIsConnected(true);
					setReconnectAttempt(0);
					setIsLoading(false);
					break;
				}

				case 'getMessages': {
					if (!initialLoadDoneRef.current) {
						const incomingList = data?.list || data?.messages || data?.payload?.list || data?.data?.list || [];
						const list: MessagePayload[] = (Array.isArray(incomingList) ? incomingList : []).map((item: any) => ({
							...item,
							text: extractText(item),
							memberData: extractMemberData(item),
						}));
						console.log('[Chat] 📝 Loaded messages:', list.length);
						setMessagesList(list);
						initialLoadDoneRef.current = true;
					}
					setIsLoading(false);
					break;
				}

				case 'message': {
					const source = data?.payload || data?.data || data;
					const normalized: MessagePayload = {
						...data,
						text: extractText(source),
						memberData: extractMemberData(source),
					};
					console.log('[Chat] 💬 New message:', normalized);
					setMessagesList((prev) => {
						const duplicated = prev.some(
							(item) =>
								item.text === normalized.text &&
								item.memberData?._id === normalized.memberData?._id &&
								Math.abs(new Date(item.createdAt || Date.now()).getTime() - new Date(normalized.createdAt || Date.now()).getTime()) <
								5000,
						);
						return duplicated ? prev : [...prev, normalized];
					});
					setIsSending(false);

					if (messageTimeoutRef.current) {
						clearTimeout(messageTimeoutRef.current);
						messageTimeoutRef.current = null;
					}
					break;
				}

				case 'newMessage':
				case 'chatMessage': {
					const source = data?.payload || data?.data || data;
					const normalized: MessagePayload = {
						...source,
						text: extractText(source),
						memberData: extractMemberData(source),
					};
					if (normalized.text) {
						setMessagesList((prev) => [...prev, normalized]);
						setIsSending(false);
					}
					break;
				}

				default:
					if (extractText(data)) {
						const normalized: MessagePayload = {
							...data,
							text: extractText(data),
							memberData: extractMemberData(data),
						};
						setMessagesList((prev) => [...prev, normalized]);
						setIsSending(false);
					} else {
						console.warn('[Chat] ⚠️ Unknown event:', eventName || data.event);
					}
			}
		} catch (err) {
			console.error('[Chat] ❌ Parse error:', err);
		}
	}, []);

	// Stable handler ref — socket listener always calls latest version
	const handlerRef = useRef(handleWebSocketMessage);
	useEffect(() => { handlerRef.current = handleWebSocketMessage; }, [handleWebSocketMessage]);

	useEffect(() => {
		if (!socket) {
			setIsConnected(false);
			setIsLoading(false);
			return;
		}

		socket.onmessage = (msg) => handlerRef.current(msg);
		socket.onerror = () => { setIsConnected(false); setIsLoading(false); };
		socket.onopen = () => {
			console.log('[Chat] ✅ Socket opened');
			setIsConnected(true);
			setReconnectAttempt(0);
			setIsLoading(false);
			initialLoadDoneRef.current = false;
			socket.send(JSON.stringify({ event: 'getMessages' }));
		};
		socket.onclose = () => {
			console.warn('[Chat] ⚠️ Socket closed');
			setIsConnected(false);
			setIsLoading(false);
		};

		if (socket.readyState === WebSocket.OPEN) {
			setIsConnected(true);
			setIsLoading(false);
			if (!initialLoadDoneRef.current) {
				socket.send(JSON.stringify({ event: 'getMessages' }));
			}
		} else if (socket.readyState === WebSocket.CONNECTING) {
			setIsLoading(true);
		} else {
			setIsConnected(false);
			setIsLoading(false);
		}
	}, [socket]); 

	useEffect(() => {
		if (isConnected || !open) return;
		if (reconnectAttempt >= 5) return;

		reconnectTimeoutRef.current = setTimeout(() => {
			setReconnectAttempt((prev) => prev + 1);
		}, Math.min(1000 * Math.pow(2, reconnectAttempt), 30000));

		return () => { if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current); };
	}, [isConnected, open, reconnectAttempt]);

	useEffect(() => {
		return () => {
			if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
			if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
		};
	}, []);

	useEffect(() => {
		if (!chatContentRef.current || messagesList.length === 0) return;
		setTimeout(() => {
			if (chatContentRef.current) {
				chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
			}
		}, 100);
	}, [messagesList]);

	useEffect(() => {
		if (open && isConnected) {
			setTimeout(() => textInput.current?.focus(), 150);
		}
	}, [open, isConnected]);

	const handleCloseChat = () => chatOpenVar(false);

	const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageInput(e.target.value);
	}, []);

	const getKeyHandler = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onClickHandler();
		}
	};

	const onClickHandler = () => {
		const trimmedMessage = messageInput.trim();
		if (!trimmedMessage) { sweetErrorAlert(Messages.error4 || 'Please enter a message'); return; }
		if (!checkUserAuthentication()) return;
		if (!checkSocketConnection()) return;
		if (isSending) return;

		try {
			setIsSending(true);
			const optimisticMessage: MessagePayload = {
				event: 'message',
				text: trimmedMessage,
				memberData: { ...user },
				createdAt: new Date().toISOString(),
			};
			setMessagesList((prev) => [...prev, optimisticMessage]);
			socket!.send(JSON.stringify({
				event: 'message',
				text: trimmedMessage,
				memberData: {
					_id: user._id,
					memberNick: user.memberNick,
					memberImage: user.memberImage,
					memberFullName: user.memberFullName,
				},
			}));
			setMessageInput('');

			messageTimeoutRef.current = setTimeout(() => {
				setIsSending(false);
				sweetErrorAlert('Message status is pending. Please check connection.');
			}, 10000);
		} catch (err) {
			console.error('[Chat] ❌ Send error:', err);
			sweetErrorAlert('Failed to send message');
			setIsSending(false);
			setMessagesList((prev) => prev.slice(0, -1));
			setMessageInput(trimmedMessage);
		}
	};

	if (!open) {
		if (device === 'mobile') {
			return (
				<Box className="mobile-chat-fab" onClick={() => chatOpenVar(true)}>
					<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 24 }} />
				</Box>
			);
		}

		return null;
	}

	return (
		<Box className="modern-chat-container">
			<Stack className="modern-chat-frame">

				<Box className="modern-chat-header">
					<Box className="header-left">
						<Box className="chat-logo-box"><UnivoLogo /></Box>
						<Box className="chat-brand">
							<div className="chat-brand-name">univo</div>
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

				<Box className="modern-chat-content" ref={chatContentRef}>
					{isLoading ? (
						<Box className="chat-loading">
							<CircularProgress size={40} />
							<div>Connecting to chat...</div>
						</Box>
					) : !isConnected ? (
						<Box className="chat-loading">
							<WifiOffIcon sx={{ fontSize: 48, color: '#999', mb: 2 }} />
							<div>Connection lost</div>
							<div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
								Attempting to reconnect... ({reconnectAttempt}/5)
							</div>
						</Box>
					) : (
						<ScrollableFeed>
							<Stack className="messages-container">

								{/* Welcome Banner */}
								<Box className="welcome-message">
									<Box className="welcome-icon">👋</Box>
									<Box>
										<div className="welcome-title">Welcome to Univo Live Chat</div>
										<div className="welcome-text">Connect with other members in real-time</div>
									</Box>
								</Box>

								{/* Empty State */}
								{messagesList.length === 0 && (
									<Box className="no-messages">
										<div>No messages yet. Be the first to say hello! 💬</div>
									</Box>
								)}

								{/* Messages */}
								{messagesList.map((msg: MessagePayload, idx: number) => {
									const { text, memberData, createdAt } = msg;

									if (!text) {
										console.warn(`[Chat] ⚠️ Message [${idx}] empty text. Full data:`, msg);
										return null;
									}

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
														<div className="message-time">{formatMessageTime(createdAt)}</div>
													)}
												</Box>
											</Box>
										</Box>
									);
								})}

								{/* Typing indicator */}
								{isSending && (
									<Box className="message-wrapper own-message sending">
										<Box className="message-content">
											<Box className="message-bubble">
												<div className="sending-dots">
													<span /><span /><span />
												</div>
											</Box>
										</Box>
									</Box>
								)}

							</Stack>
						</ScrollableFeed>
					)}
				</Box>

				<Box className="modern-chat-input">
					{!isConnected && (
						<Box className="connection-warning">
							<WifiOffIcon sx={{ fontSize: 16, mr: 0.5 }} />
							<span>Reconnecting... ({reconnectAttempt}/5)</span>
						</Box>
					)}
					{!user?._id && (
						<Box className="auth-warning">Please login to send messages</Box>
					)}
					{isConnected && !!user?._id && (
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
								{isSending
									? <CircularProgress size={20} sx={{ color: '#fff' }} />
									: <SendIcon sx={{ fontSize: 20 }} />
								}
							</button>
						</>
					)}
				</Box>

			</Stack>
		</Box>
	);
};

export default Chat;