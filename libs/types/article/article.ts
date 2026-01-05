import { ArticleCategory, ArticleStatus } from '../../enums/article.enum'; 
import { Member } from '../member/member';
import { MeLiked } from '../like/like'; 
import { TotalCounter } from '../product/product';


export interface Article { 
	_id: string;
	articleCategory: ArticleCategory; 
	articleStatus: ArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImage?: string; 
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked; 
	memberData?: Member;
}

export interface Articles { 
	list: Article[];
	metaCounter: TotalCounter; 
}
