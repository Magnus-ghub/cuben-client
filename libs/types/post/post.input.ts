import { Direction } from '../../enums/common.enum';
import { PostStatus } from '../../enums/post.enum';

export interface PostInput {
	postTitle: string;
	postContent: string;
	postImage: string;
	memberId?: string;
}

interface PISearch {
	text?: string;
}

export interface PostsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface POSISearch {
	postStatus?: PostStatus;
}

export interface AllPostsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: POSISearch;
}
