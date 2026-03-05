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
import { chatOpenVar, socketVar, userVar } from '../../libs/apollo/store';
import { getJwtToken } from '../auth';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { UnivoLogo } from './common/UnivoLogo';
import useDeviceDetect from '../hooks/useDeviceDetect';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<Box
				component={'div'}
				flexDirection={'row'}
				style={{ display: 'flex' }}
				alignItems={'flex-end'}
				justifyContent={'flex-end'}
				sx={{ m: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</Box>
		);
	} else {
		return (
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg_left'}></div>
			</Box>
		);
	}
};

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


const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const textInput = useRef(null);
	const [messageInput, setMessageInput] = useState<string>('');
	const open = useReactiveVar(chatOpenVar);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
	const [openButton, setOpenButton] = useState(false);
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar)
	const device = useDeviceDetect();

	const handleCloseChat = () => {
		chatOpenVar(false);
	};

	useEffect(() => {
		if (!open) return;

		const token = getJwtToken();
		if (!token) {
			setIsLoading(false);
			setIsConnected(false);
			return;
		}

		setIsLoading(true);
		const wsBase = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5007';
		const ws = new WebSocket(`${wsBase}?token=${encodeURIComponent(token)}`);
		socketVar(ws);

		ws.onopen = () => {
			setIsConnected(true);
			setIsLoading(false);
			setReconnectAttempt(0);
		};

		ws.onerror = () => {
			setIsConnected(false);
			setIsLoading(false);
		};

		ws.onclose = () => {
			setIsConnected(false);
			setIsLoading(false);
			setReconnectAttempt((prev) => prev + 1);
		};

		return () => {
			if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
				ws.close();
			}
			socketVar(null);
		};
	}, [open]);

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			console.log('WebSocket message: ', data);

			switch(data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList((prev) => [...prev, newMessage]);
					break;	
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, []);


	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if(!messageInput) sweetErrorAlert(Messages.error4);
		else if (!socket || socket.readyState !== WebSocket.OPEN) return;
		else {
			setIsSending(true);
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
			setIsSending(false);
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