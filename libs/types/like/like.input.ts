import { LikeTarget, LikeAction } from '../../enums/like.enum';

export interface LikeInput {
	refId: string; 
	targetType: LikeTarget; 
	action: LikeAction; 
}