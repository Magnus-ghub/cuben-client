import { PostStatus } from '../../enums/post.enum';

export interface PostUpdate {
	_id: string;
	postStatus?: PostStatus;
	postTitle?: string;
	postContent?: string;
	postImages?: string[];
	blockedAt?: Date; 
	deletedAt?: Date; 
}