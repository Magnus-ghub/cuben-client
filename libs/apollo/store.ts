import { makeVar } from '@apollo/client';
import { CustomJwtPayload } from '../types/customJwtPayload';

/**
 * Apollo Reactive Variables
 * These variables can be accessed and modified from anywhere in the app
 * and trigger re-renders when their values change
 */

/** Theme State **/
export const themeVar = makeVar({});

/** User State **/
export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberFollowers: 0,
	memberFollowings: 0,
	memberPhone: '',
	memberEmail: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberProducts: 0,
	memberPosts: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});

/** WebSocket State **/
// @ts-ignore
export const socketVar = makeVar<WebSocket>();

/** Chat UI State **/
export const chatOpenVar = makeVar<boolean>(false);

/**
 * Helper functions to manage reactive variables
 */

// Set user data
export const setUser = (user: CustomJwtPayload) => {
	userVar(user);
	if (user && user._id) {
		console.log('✅ User set:', user.memberNick);
		// Save to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('user', JSON.stringify(user));
		}
	} else {
		console.log('🚪 User logged out');
	}
};

// Get current user
export const getUser = (): CustomJwtPayload => {
	return userVar();
};

// Set socket instance
export const setSocket = (socket: WebSocket | null) => {
	// @ts-ignore
	socketVar(socket);
	if (socket) {
		console.log('✅ Socket set - ReadyState:', socket.readyState);
	} else {
		console.log('🔌 Socket cleared');
	}
};

// Get current socket
export const getSocket = (): WebSocket | null => {
	return socketVar();
};

// Toggle chat open/close
export const toggleChat = () => {
	const currentState = chatOpenVar();
	chatOpenVar(!currentState);
	console.log('💬 Chat toggled:', !currentState ? 'OPEN' : 'CLOSED');
};

// Set chat state explicitly
export const setChatOpen = (isOpen: boolean) => {
	chatOpenVar(isOpen);
	console.log('💬 Chat set to:', isOpen ? 'OPEN' : 'CLOSED');
};

// Get chat state
export const getChatOpen = (): boolean => {
	return chatOpenVar();
};

/**
 * Initialize store with default values
 */
export const initializeStore = () => {
	console.log('🏪 Initializing Apollo store...');
	
	// Check for stored user data
	if (typeof window !== 'undefined') {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			try {
				const userData = JSON.parse(storedUser);
				userVar(userData);
				console.log('✅ User restored from localStorage:', userData.memberNick);
			} catch (error) {
				console.error('❌ Error parsing stored user:', error);
				localStorage.removeItem('user');
			}
		}
	}

	console.log('✅ Store initialized');
};

/**
 * Clear all store data (useful for logout)
 */
export const clearStore = () => {
	console.log('🧹 Clearing store...');
	
	// Reset user to default empty state
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberFollowers: 0,
		memberFollowings: 0,
		memberPhone: '',
		memberEmail: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberProducts: 0,
		memberPosts: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
	
	chatOpenVar(false);
	// Note: socketVar is not cleared as it's managed by _app.tsx
	
	if (typeof window !== 'undefined') {
		localStorage.removeItem('user');
		localStorage.removeItem('accessToken');
	}
	
	console.log('✅ Store cleared');
};