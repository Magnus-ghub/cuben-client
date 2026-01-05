import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

export interface CommentInput {
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
}

interface CommentSearch { 
	commentRefId: string;
}

export interface CommentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CommentSearch; 
}