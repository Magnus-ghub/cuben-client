import { ProductLocation, ProductStatus, ProductType } from "../../enums/product.enum";

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;
	productStatus?: ProductStatus;
	productLocation?: ProductLocation;
	productAddress?: string;
	productTitle?: string;
	productPrice?: number;
	productImages?: string[];
	productDesc?: string;
	soldAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}
