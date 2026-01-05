import { Direction } from '../../enums/common.enum';
import { PostStatus } from '../../enums/post.enum';

export interface PostInput {
	postTitle: string;
	postContent: string;
	postImages?: string[]; 
	memberId?: string;
}

interface PostSearch { 
	text?: string;
	memberId?: string; 
}

export interface PostsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PostSearch; 
}

interface AllPostSearch { 
	postStatus?: PostStatus;
}

export interface AllPostsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AllPostSearch; 
}