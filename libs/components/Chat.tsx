import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';
import { socketVar, userVar, chatOpenVar } from '../apollo/store';

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
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
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const open = useReactiveVar(chatOpenVar);

	/** LIFECYCLES **/
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
					setMessagesList(prev => [...prev, newMessage]);
					break;	
			}
		};
	}, [socket]);

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
		if (e.key === 'Enter') {
			onClickHandler();
		}
	};

	const onClickHandler = () => {
		if(!messageInput.trim()) {
			sweetErrorAlert(Messages.error4);
		} else if(socket) {
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
		}
	};

	if (!open) return null;

	return (
		<Box className="modern-chat-container">
			<Stack className="modern-chat-frame">
				{/* Header - Reddit style */}
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
						<Box className="online-badge">
							<Box className="online-dot" />
							<span>{onlineUsers} online</span>
						</Box>
						<Box className="close-btn" onClick={handleCloseChat}>
							<CloseIcon sx={{ fontSize: 20 }} />
						</Box>
					</Box>
				</Box>

				{/* Messages Content */}
				<Box className="modern-chat-content" ref={chatContentRef}>
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

							{/* Messages */}
							{messagesList.map((msg: MessagePayload, idx: number) => {
								const { text, memberData } = msg;
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
												<div className="message-author">{memberData?.memberNick || 'Anonymous'}</div>
											)}
											<Box className="message-bubble">
												{text}
											</Box>
										</Box>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>

				{/* Input Area */}
				<Box className="modern-chat-input">
					<input
						ref={textInput}
						type="text"
						value={messageInput}
						className="chat-input-field"
						placeholder="Type a message..."
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className="chat-send-btn" onClick={onClickHandler}>
						<SendIcon sx={{ fontSize: 20 }} />
					</button>
				</Box>
			</Stack>
		</Box>
	);
};

export default Chat;