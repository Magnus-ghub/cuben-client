import { ProductCondition, ProductLocation, ProductStatus, ProductType } from "../../enums/product.enum";

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;
	productStatus?: ProductStatus;
	productCondition?: ProductCondition; 
	productLocation?: ProductLocation;
	productAddress?: string;
	productTitle?: string;
	productPrice?: number;
	productImages?: string[];
	productDesc?: string;
	isSold?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
}