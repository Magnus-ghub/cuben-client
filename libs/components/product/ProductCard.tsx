import React, { useState } from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Product } from '../../types/product/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { userVar } from '../../apollo/store';

interface ProductTypeCard {
	product: Product;
	likeProductHandler?: any;
	saveProductHandler?: any; 
	myFavorites?: boolean;
	recentlyVisited?: boolean;
	savedItems?: boolean;
}

const ProductCard = (props: ProductTypeCard) => {
	const { product, likeProductHandler, saveProductHandler, myFavorites, recentlyVisited, savedItems } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	
	const imagePath: string = product?.productImages[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/default-product.png';

	// Fix: Single object access for meLiked (no [0])
	const isLiked = product.meLiked?.liked || false;
	const isSaved = product.meLiked?.saved || false;

	// Format price with commas
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US').format(price);
	};

	if (device === 'mobile') {
		return <div>Product card</div>;
	} else {
		return (
			<div className="product-card">
				{/* Image Section */}
				<Link
					href={{
						pathname: '/product/detail',
						query: { id: product?._id },
					}}
					className="card-image-link"
				>
					<div className="card-image-wrapper">
						<img src={imagePath} alt={product?.productTitle} className="card-image" />
						
						{/* Badges */}
						<Stack className="badge-container">
							<Stack className="condition-badge">
								<Typography component="p">{product?.productCondition || 'N/A'}</Typography>
							</Stack>
						</Stack>

						{/* Price Tag */}
						{product?.productPrice && (
							<Stack className="price-tag">
								<Typography className="price">
									${formatPrice(product.productPrice)}
								</Typography>
							</Stack>
						)}
					</div>
				</Link>

				{/* Content Section */}
				<Stack className="card-content">
					{/* Header */}
					<Stack className="card-header">
						<Link
							href={{
								pathname: '/product/detail',
								query: { id: product?._id },
							}}
							className="card-title-link"
						>
							<Typography className="card-title">{product?.productTitle}</Typography>
						</Link>
						<Stack className="category-badge">
							<Typography component="p">
								{product.productType}
							</Typography>
						</Stack>
					</Stack>

					{/* Description */}
					{product?.productDesc && (
						<Typography className="card-description">
							{product.productDesc.length > 60 
								? `${product.productDesc.substring(0, 60)}...` 
								: product.productDesc}
						</Typography>
					)}

					{/* Location */}
					<Stack className="card-location">
						<Typography className="location-text">
							{product?.productLocation}
							{product?.productAddress && `, ${product.productAddress}`}
						</Typography>
					</Stack>

					{/* Seller Section */}
					<Stack className="seller-section">
						<Stack className="seller-info">
							<Avatar
								src={
									product?.memberData?.memberImage
										? `${REACT_APP_API_URL}/${product?.memberData?.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								alt={product?.memberData?.memberNick}
								className="seller-avatar"
							/>
							<Stack className="seller-details">
								<Link href={`/member?memberId=${product?.memberData?._id}`}>
									<Typography className="seller-name">{product?.memberData?.memberNick}</Typography>
								</Link>
								<Typography className="post-time">{moment(product?.createdAt).fromNow()}</Typography>
							</Stack>
						</Stack>
						<Stack className={`status-badge ${product?.productStatus?.toLowerCase()}`}>
							<Typography component="p">
								{product?.soldAt ? 'SOLD' : product?.productStatus}
							</Typography>
						</Stack>
					</Stack>

					{/* Actions */}
					<Stack className="card-actions">
						<Stack className="stats">
							<Stack className="stat-item">
								<RemoveRedEyeIcon className="stat-icon" />
								<Typography className="stat-text">{product?.productViews}</Typography>
							</Stack>
							<Stack className="stat-item">
								<FavoriteIcon
									className={`stat-icon ${isLiked ? 'favorited' : ''}`}
								/>
								<Typography className="stat-text">{product?.productLikes}</Typography>
							</Stack>
						</Stack>

						<Stack className="action-buttons">
							{/* Like Button */}
							<IconButton
								className="action-btn"
								onClick={() => likeProductHandler(user, product?._id)}
								disabled={recentlyVisited || !user?._id}
							>
								{isLiked ? (
									<FavoriteIcon className="favorited" />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>

							{/* Save Button */}
							<IconButton
								className="action-btn"
								onClick={() => saveProductHandler(user, product?._id)}
								disabled={!user?._id}
							>
								{isSaved ? (
									<BookmarkIcon className="saved" />
								) : (
									<BookmarkBorderIcon />
								)}
							</IconButton>
						</Stack>
					</Stack>
				</Stack>
			</div>
		);
	}
};

export default ProductCard;