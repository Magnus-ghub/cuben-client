import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	memberType: string;
	memberStatus: string;
	memberAuthType: string;
	memberPhone: string;
	memberEmail: string;
	memberNick: string;
	memberFullName?: string;
	memberFollowers: number;
	memberFollowings: number;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberProducts: number;
	memberPosts: 0,
	memberRank: number;
	memberArticles: number;
	memberPoints: number;
	memberLikes: number;
	memberViews: number;
	memberWarnings: number;
	memberBlocks: number;
}
