import { ProductCondition, ProductStatus, ProductType } from "../../enums/product.enum";
import { TotalCounter } from "../common";
import { MeLiked } from "../like/like"; 
import { Member } from "../member/member";

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productCondition: ProductCondition;
	productName: string;
	productAddress?: string;
	productPrice: number;
	productViews: number;
	productLikes: number;
	productImages: string[];
	productDesc?: string;
	memberId: string;
	isSold: boolean; 
	soldAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked; 
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter; 
}