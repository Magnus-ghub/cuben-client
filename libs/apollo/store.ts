import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../../libs/types/customJwtPayload';
export const themeVar = makeVar({});
export const chatOpenVar = makeVar<boolean>(false);

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

export const socketVar = makeVar<WebSocket | null>(null);
