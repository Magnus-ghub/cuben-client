import { ProductCondition, ProductLocation, ProductStatus, ProductType } from "../../enums/product.enum";
import { MeLiked } from "../like/like";
import { Member } from "../member/member";


export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productCondition: ProductCondition;
	productLocation: ProductLocation;
	productTitle: string;
	productAddress?: string;
	productPrice: number;
	productViews: number;
	productLikes: number;
	productImages: string[];
	productDesc?: string;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meSaved?: MeLiked[];
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
