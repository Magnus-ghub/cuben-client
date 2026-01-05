import { PostStatus } from '../../enums/post.enum';
import { TotalCounter } from '../common';
import { MeLiked } from '../like/like'; 
import { Member } from '../member/member';

export interface Post {
	_id: string;
	postStatus: PostStatus;
	postTitle: string;
	postContent: string;
	postImages?: string[]; 
	postLikes: number;
	postComments: number;
	postSaves: number; 
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked; 
	memberData?: Member;
}

export interface Posts {
	list: Post[];
	metaCounter: TotalCounter; 
}