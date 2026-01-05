import { ArticleStatus } from '../../enums/article.enum';

export interface ArticleUpdate { 
	_id: string;
	articleStatus?: ArticleStatus; 
	articleCategory?: string; 
	articleTitle?: string;
	articleContent?: string;
	articleImage?: string;
}
