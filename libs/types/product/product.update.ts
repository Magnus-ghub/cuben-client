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
	productBarter?: boolean;
	productRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}
