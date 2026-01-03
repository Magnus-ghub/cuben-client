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
	myFavorites?: boolean;
	recentlyVisited?: boolean;
	savedItems?: boolean;
}

const ProductCard = (props: ProductTypeCard) => {
	const { product, likeProductHandler, myFavorites, recentlyVisited, savedItems } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	
	// Save functionality - hozircha hard coding
	const [isSaved, setIsSaved] = useState(false);
	
	// Product image path
	const imagePath: string = product?.productImages[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/product/default-product.jpg';

	// Hard coded data (backend da yo'q)
	const getCategoryFromType = (type: string): string => {
		const categoryMap: { [key: string]: string } = {
			'ELECTRONICS': 'Electronics',
			'FURNITURE': 'Furniture', 
			'BOOKS': 'Books',
			'CLOTHING': 'Clothing',
			'SPORTS': 'Sports',
			'OTHER': 'Other'
		};
		return categoryMap[type] || type;
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
								<Typography component="p">{product?.productCondition}</Typography>
							</Stack>
						</Stack>
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
								{getCategoryFromType(product?.productType)}
							</Typography>
						</Stack>
					</Stack>

					{/* Description - Hard coded short version */}
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
									className={`stat-icon ${
										(myFavorites || product?.meLiked?.[0]?.myFavorite) ? 'favorited' : ''
									}`}
								/>
								<Typography className="stat-text">{product?.productLikes}</Typography>
							</Stack>
						</Stack>

						<Stack className="action-buttons">
							{/* Like Button */}
							<IconButton
								className="action-btn"
								onClick={() => likeProductHandler(user, product?._id)}
								disabled={recentlyVisited}
							>
								{myFavorites || product?.meLiked?.[0]?.myFavorite ? (
									<FavoriteIcon className="favorited" />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>

							{/* Save Button - Hard coding */}
							<IconButton
								className="action-btn"
								onClick={() => setIsSaved(!isSaved)}
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