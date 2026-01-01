import { PostStatus } from '../../enums/post.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../product/product';

export interface Post {
	_id: string;
	postStatus: PostStatus;
	postTitle: string;
	postContent: string;
	postImages: string[];
	postLikes: number;
	postComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Posts {
	list: Post[];
	metaCounter: TotalCounter[];
}
