import { PostStatus } from '../../enums/post.enum';
import { Member } from '../member/member';
import { MeLiked, MeSaved, TotalCounter } from '../product/product';

export interface Post {
	_id: string;
	postStatus: PostStatus;
	postTitle: string;
	postContent: string;
	postImages: string[];
	postLikes: number;
	postComments: number;
	postSaves: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meSaved?: MeSaved[];
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Posts {
	list: Post[];
	metaCounter: TotalCounter[];
}
