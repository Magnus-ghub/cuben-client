import { ProductCondition, ProductLocation, ProductStatus, ProductType } from "../../enums/product.enum";
import { Member } from "../member/member";

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface MeSaved {
	memberId: string;
	saveRefId: string;
	mySaves: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productCondition: ProductCondition;
	productLocation: ProductLocation;
	productName: string;
	productAddress: string;
	productTitle: string;
	productPrice: number;
	productRooms: number;
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	productImages: string[];
	productDesc?: string;
	productBarter: boolean;
	productRent: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meSaved?: MeSaved[];
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
