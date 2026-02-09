import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/apollo/client';
import { appWithTranslation } from 'next-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { socketVar } from '../libs/apollo/store';
import '../scss/app.scss';
import '../scss/pc/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	const socketRef = useRef<WebSocket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [reconnectAttempt, setReconnectAttempt] = useState(0);
	const maxReconnectAttempts = 10;
	const isInitializedRef = useRef(false);

	// WebSocket URL configuration
	const getWebSocketUrl = useCallback((): string => {
		if (typeof window === 'undefined') return '';
		
		// Priority 1: Environment variables
		let wsUrl = process.env.NEXT_PUBLIC_API_WS || process.env.REACT_APP_API_WS;
		
		if (wsUrl) {
			console.log('✅ Using WebSocket URL from env:', wsUrl);
			return wsUrl;
		}
		
		// Priority 2: Construct from window location
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const host = window.location.host;
		
		// If running on localhost, use different port for WebSocket server
		if (host.includes('localhost') || host.includes('127.0.0.1')) {
			// Assuming WebSocket server runs on port 3003
			const wsPort = '3003';
			wsUrl = `${protocol}//localhost:${wsPort}`;
		} else {
			// Production: same host, different path or port
			wsUrl = `${protocol}//${host}/ws`;
		}
		
		console.log('✅ Constructed WebSocket URL:', wsUrl);
		return wsUrl;
	}, []);

	// Initialize WebSocket connection
	const initializeWebSocket = useCallback(() => {
		if (typeof window === 'undefined') return;
		
		// Prevent multiple initializations
		if (isInitializedRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
			console.log('⚠️ WebSocket already connected, skipping initialization');
			return;
		}
		
		// Clean up existing socket
		if (socketRef.current) {
			console.log('🧹 Cleaning up existing WebSocket');
			
			try {
				socketRef.current.onopen = null;
				socketRef.current.onmessage = null;
				socketRef.current.onerror = null;
				socketRef.current.onclose = null;
				
				if (socketRef.current.readyState === WebSocket.OPEN || 
					socketRef.current.readyState === WebSocket.CONNECTING) {
					socketRef.current.close();
				}
			} catch (err) {
				console.error('❌ Error cleaning up socket:', err);
			}
		}
		
		try {
			let wsUrl = getWebSocketUrl();
			
			if (!wsUrl) {
				console.error('❌ No WebSocket URL available');
				return;
			}

			// Add JWT token if available
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('access_token');
				if (token) {
					const separator = wsUrl.includes('?') ? '&' : '?';
					wsUrl += `${separator}token=${encodeURIComponent(token)}`;
					console.log('🔐 Added JWT token to WebSocket URL');
				}
			}
			
			console.log('🔌 Connecting to WebSocket:', wsUrl);
			const socket = new WebSocket(wsUrl);
			socketRef.current = socket;
			socketVar(socket);
			isInitializedRef.current = true;

			socket.onopen = () => {
				console.log('✅ WebSocket connected successfully');
				console.log('   ReadyState:', socket.readyState);
				setReconnectAttempt(0); // Reset reconnect counter
				
				// Send initial handshake
				try {
					socket.send(JSON.stringify({ 
						event: 'connect',
						timestamp: new Date().toISOString()
					}));
					console.log('📤 Handshake sent');
				} catch (err) {
					console.error('❌ Error sending handshake:', err);
				}
			};

			socket.onerror = (error) => {
				console.error('❌ WebSocket error:', error);
				console.error('   ReadyState:', socket.readyState);
			};

			socket.onclose = (event) => {
				console.log('⚠️ WebSocket closed');
				console.log('   Code:', event.code);
				console.log('   Reason:', event.reason);
				console.log('   Clean:', event.wasClean);
				
				isInitializedRef.current = false;
				
				// Auto-reconnect logic
				if (reconnectAttempt < maxReconnectAttempts) {
					const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
					console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${reconnectAttempt + 1}/${maxReconnectAttempts})`);
					
					reconnectTimeoutRef.current = setTimeout(() => {
						setReconnectAttempt(prev => prev + 1);
					}, delay);
				} else {
					console.error('❌ Max reconnection attempts reached');
				}
			};

			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					console.log('📩 WebSocket message (app level):', data.event);
					// Messages are handled in Chat component
				} catch (err) {
					console.error('❌ Error parsing message:', err);
				}
			};

		} catch (error) {
			console.error('❌ Failed to create WebSocket:', error);
			isInitializedRef.current = false;
			
			// Retry connection
			if (reconnectAttempt < maxReconnectAttempts) {
				const delay = 5000; // 5 seconds on initial error
				console.log(`🔄 Retrying connection in ${delay}ms...`);
				reconnectTimeoutRef.current = setTimeout(() => {
					setReconnectAttempt(prev => prev + 1);
				}, delay);
			}
		}
	}, [reconnectAttempt, getWebSocketUrl, maxReconnectAttempts]);

	// Initialize WebSocket on mount
	useEffect(() => {
		console.log('🚀 App mounted - initializing WebSocket');
		initializeWebSocket();

		// Cleanup on unmount
		return () => {
			console.log('🧹 App unmounting - cleaning up WebSocket');
			
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			
			if (socketRef.current) {
				try {
					socketRef.current.onopen = null;
					socketRef.current.onmessage = null;
					socketRef.current.onerror = null;
					socketRef.current.onclose = null;
					
					if (socketRef.current.readyState === WebSocket.OPEN) {
						socketRef.current.close(1000, 'App unmounting');
					}
				} catch (err) {
					console.error('❌ Error during cleanup:', err);
				}
			}
			
			isInitializedRef.current = false;
		};
	}, []); // Empty dependency array - run once on mount

	// Handle reconnect attempts
	useEffect(() => {
		if (reconnectAttempt > 0 && reconnectAttempt <= maxReconnectAttempts) {
			console.log(`🔄 Reconnect attempt ${reconnectAttempt}/${maxReconnectAttempts}`);
			initializeWebSocket();
		}
	}, [reconnectAttempt, initializeWebSocket, maxReconnectAttempts]);

	// Listen for online/offline events
	useEffect(() => {
		const handleOnline = () => {
			console.log('🌐 Network online - attempting to reconnect WebSocket');
			setReconnectAttempt(0);
			isInitializedRef.current = false;
			initializeWebSocket();
		};

		const handleOffline = () => {
			console.log('📵 Network offline');
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('online', handleOnline);
			window.addEventListener('offline', handleOffline);

			return () => {
				window.removeEventListener('online', handleOnline);
				window.removeEventListener('offline', handleOffline);
			};
		}
	}, [initializeWebSocket]);

	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
			<ApolloProvider client={client}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</ApolloProvider>
		</GoogleOAuthProvider>
	);
};

export default appWithTranslation(App);