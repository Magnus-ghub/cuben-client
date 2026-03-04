import { useEffect, useRef } from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar, socketVar, setSocket } from '../apollo/store';
import { getJwtToken } from '../auth';

const resolveWsBaseUrl = (): string | null => {
	const directWsUrl = process.env.NEXT_PUBLIC_API_WS || process.env.REACT_APP_API_WS;
	if (directWsUrl) return directWsUrl.replace(/\/$/, '');

	const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
	if (!apiUrl) return null;

	return apiUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:').replace(/\/$/, '');
};

const SocketManager = () => {
	const user = useReactiveVar(userVar);
	const socketRef = useRef<WebSocket | null>(null);
	const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectCountRef = useRef<number>(0);
	const isMountedRef = useRef<boolean>(false);

	const MAX_RECONNECT = 5;

	const createSocket = () => {
		if (!isMountedRef.current) return;

		const token = getJwtToken();
		const wsBaseUrl = resolveWsBaseUrl();
		if (!token) {
			console.warn('[SocketManager] No JWT token — skipping socket creation');
			return;
		}
		if (!wsBaseUrl) {
			console.error('[SocketManager] Missing websocket URL. Set NEXT_PUBLIC_API_WS or REACT_APP_API_WS');
			return;
		}

		const wsUrl = `${wsBaseUrl}?token=${encodeURIComponent(token)}`;
		console.log('[SocketManager] Creating WebSocket...');

		const ws = new WebSocket(wsUrl);
		socketRef.current = ws;

		ws.onopen = () => {
			console.log('[SocketManager] ✅ Connected');
			reconnectCountRef.current = 0;

			if (isMountedRef.current) {
				setSocket(ws); // push to Apollo reactive var → Chat component re-renders
			}
		};

		ws.onerror = (err) => {
			console.error('[SocketManager] ❌ Error:', err);
		};

		ws.onclose = (event) => {
			console.warn('[SocketManager] ⚠️ Closed. Code:', event.code);

			if (isMountedRef.current) {
				setSocket(null);
			}

			// Auto-reconnect if still mounted, user still logged in, and not exceeded max
			if (
				isMountedRef.current &&
				user?._id &&
				reconnectCountRef.current < MAX_RECONNECT
			) {
				const delay = Math.min(1000 * Math.pow(2, reconnectCountRef.current), 30000);
				reconnectCountRef.current += 1;

				console.log(
					`[SocketManager] 🔄 Reconnect attempt ${reconnectCountRef.current}/${MAX_RECONNECT} in ${delay}ms`,
				);

				reconnectTimerRef.current = setTimeout(() => {
					createSocket();
				}, delay);
			} else if (reconnectCountRef.current >= MAX_RECONNECT) {
				console.error('[SocketManager] ❌ Max reconnect attempts reached');
			}
		};
	};

	const destroySocket = () => {
		// Clear any pending reconnect
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current);
			reconnectTimerRef.current = null;
		}

		if (socketRef.current) {
			// Remove event handlers so onclose doesn't trigger auto-reconnect during deliberate close
			socketRef.current.onclose = null;
			socketRef.current.onerror = null;
			socketRef.current.onopen = null;
			socketRef.current.onmessage = null;
			socketRef.current.close();
			socketRef.current = null;
		}

		setSocket(null);
		reconnectCountRef.current = 0;
	};

	useEffect(() => {
		isMountedRef.current = true;

		if (!user?._id) {
			// User logged out
			console.log('[SocketManager] 👤 User not logged in — destroying socket');
			destroySocket();
			return;
		}

		// User logged in — connect if not already
		const currentSocket = socketRef.current;
		const alreadyConnected =
			currentSocket &&
			(currentSocket.readyState === WebSocket.OPEN ||
				currentSocket.readyState === WebSocket.CONNECTING);

		if (!alreadyConnected) {
			createSocket();
		}

		return () => {
			isMountedRef.current = false;
			if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
			// NOTE: do NOT destroy socket on unmount — it stays alive globally
		};
	}, [user?._id]); // only re-runs when user logs in or out

	return null;
};

export default SocketManager;