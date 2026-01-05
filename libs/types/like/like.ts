import { LikeTarget, LikeAction } from '../../enums/like.enum';

export interface Like {
	_id: string;
	targetType: LikeTarget; 
	action: LikeAction; 
	refId: string; 
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MeLiked {
	liked: boolean; 
	saved: boolean; 
}