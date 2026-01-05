import { Direction } from "../../enums/common.enum";
import { ProductLocation, ProductStatus, ProductType, ProductCondition } from "../../enums/product.enum"; // Added ProductCondition

export interface ProductInput {
	productType: ProductType;
	productLocation: ProductLocation;
	productAddress?: string;
	productTitle: string;
	productPrice: number;
	productImages: string[]; 
	productDesc?: string;
	memberId?: string;
	
}

interface ProductSearch { 
	memberId?: string;
	locationList?: ProductLocation[];
	typeList?: ProductType[];
	condition?: ProductCondition; 
	options?: string[]; 
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ProductSearch; 
}

interface AgentProductSearch { 
	productStatus?: ProductStatus;
}

export interface AgentProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AgentProductSearch; 
}

interface AllProductSearch { 
	productStatus?: ProductStatus;
	productLocationList?: ProductLocation[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AllProductSearch; 
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}