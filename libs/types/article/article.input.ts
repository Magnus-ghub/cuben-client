import { ArticleCategory, ArticleStatus } from '../../enums/article.enum'; 
import { Direction } from '../../enums/common.enum';

export interface ArticleInput { 
	articleCategory: ArticleCategory; 
	articleTitle: string;
	articleContent: string;
	articleImage?: string; 
	memberId?: string;
}

interface ArticleSearch { 
	articleCategory?: ArticleCategory; 
	text?: string;
	memberId?: string; 
}

export interface ArticlesInquiry { 
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ArticleSearch; 
}

interface AllArticleSearch { 
	articleStatus?: ArticleStatus; 
	articleCategory?: ArticleCategory; 
}

export interface AllArticlesInquiry { 
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AllArticleSearch; 
}