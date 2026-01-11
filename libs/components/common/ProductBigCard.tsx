import React, { useState, useEffect } from 'react';
import { Stack, Box, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../apollo/store';

interface ProductBigCardProps {
	product: Product;
	likeProductHandler?: any;
	saveProductHandler?: any;
}

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product, likeProductHandler, saveProductHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	
	const [isLiked, setIsLiked] = useState(product?.meLiked?.liked || false);
	const [isSaved, setIsSaved] = useState(product?.meLiked?.saved || false);

	useEffect(() => {
		setIsLiked(product?.meLiked?.liked || false);
		setIsSaved(product?.meLiked?.saved || false);
	}, [product]);

	/** HANDLERS **/
	const goProductDetailPage = (productId: string) => {
		router.push(`/product/detail?id=${productId}`);
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (likeProductHandler) {
			likeProductHandler(user, product?._id);
			setIsLiked(!isLiked);
		}
	};

	const handleSaveClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (saveProductHandler) {
			saveProductHandler(user, product?._id);
			setIsSaved(!isSaved);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD MOBILE</div>;
	} else {
		return (
			<Stack className="product-big-card-box" onClick={() => goProductDetailPage(product?._id)}>
				{/* Image Section */}
				<Box component={'div'} className={'card-img'}>
					<img
						src={
							product?.productImages?.length > 0
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/default-product.png'
						}
						alt={product?.productTitle || 'product image'}
					/>

					{/* Status Badge - Top (Like New, Excellent, etc.) */}
					{product?.productCondition && (
						<div className={'status'}>
							<span>{product.productCondition}</span>
						</div>
					)}

					{/* Price Tag - Bottom */}
					<div className={'price'}>₩{product?.productPrice?.toLocaleString()}</div>
				</Box>

				{/* Info Section */}
				<Box component={'div'} className={'info'}>
					{/* Title */}
					<strong className={'title'}>{product?.productTitle}</strong>

					{/* Description (Location/Address) */}
					<p className={'desc'}>{product?.productAddress || product?.productDesc}</p>

					{/* Options (Category, Type, etc.) */}
					{product?.productType && (
						<div className={'options'}>
							<div>
								<img src="/img/icons/category.svg" alt="" />
								<span>{product.productType}</span>
							</div>
						</div>
					)}

					{/* Bottom Section */}
					<div className={'bott'}>
						{/* Tags (Available, Negotiable, etc.) */}
						<div className="tags-box">
							{product?.productStatus === 'ACTIVE' ? <p>Available</p> : <span>Sold</span>}
							<p>Negotiable</p>
						</div>

						{/* Action Buttons (Views + Likes + Save) */}
						<div className="buttons-box">
							{/* Views */}
							<IconButton color={'default'} size="small">
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{product?.productViews || 0}</Typography>

							{/* Likes */}
							<IconButton 
								color={'default'} 
								size="small" 
								onClick={handleLikeClick}
								disabled={!user?._id}
							>
								{isLiked ? (
									<FavoriteIcon className="liked" />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{product?.productLikes || 0}</Typography>

							{/* Save */}
							<IconButton 
								color={'default'} 
								size="small" 
								onClick={handleSaveClick}
								disabled={!user?._id}
							>
								{isSaved ? (
									<BookmarkIcon className="saved" />
								) : (
									<BookmarkBorderIcon />
								)}
							</IconButton>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default ProductBigCard;