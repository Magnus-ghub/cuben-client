import React, { useState } from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Product } from '../../types/product/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';

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
	const [isFavorited, setIsFavorited] = useState(false);

	if (device === 'mobile') {
		return <div>Product card</div>;
	} else {
		return (
			<div className="product-card">
				{/* Image Section */}
				<a href="/product/detail" className="card-image-link">
					<div className="card-image-wrapper">
						<img src="/img/product/macbookpro.jpeg" alt="Product" className="card-image" />

						{/* Badges */}
						<Stack className="badge-container">
							<Stack className="condition-badge">
								<Typography component="p">Like New</Typography>
							</Stack>
						</Stack>

						{/* Price Tag */}
						<Stack className="price-tag">
							<Typography className="price">₩45,000</Typography>
						</Stack>
					</div>
				</a>

				{/* Content Section */}
				<Stack className="card-content">
					{/* Header */}
					<Stack className="card-header">
						<a href="/product/detail" className="card-title-link">
							<Typography className="card-title">Calculus Textbook Bundle with Solutions</Typography>
						</a>
						<Stack className="category-badge">
							<Typography component="p">BOOK</Typography>
						</Stack>
					</Stack>

					{/* Location */}
					<Stack className="card-location">
						<Typography className="location-text">📍 Main Library, 2nd Floor</Typography>
					</Stack>

					{/* Seller Section */}
					<Stack className="seller-section">
						<Stack className="seller-info">
							<Avatar src="/img/user/default.png" alt="Seller" className="seller-avatar" />
							<Stack className="seller-details">
								<Typography className="seller-name">John Doe</Typography>
								<Typography className="post-time">2 days ago</Typography>
							</Stack>
						</Stack>
						<Stack className="status-badge available">
							<Typography component="p">Available</Typography>
						</Stack>
					</Stack>

					{/* Actions */}
					<Stack className="card-actions">
						<Stack className="stats">
							<Stack className="stat-item">
								<RemoveRedEyeIcon className="stat-icon" />
								<Typography className="stat-text">245</Typography>
							</Stack>
							<Stack className="stat-item">
								<FavoriteIcon className={`stat-icon ${isFavorited ? 'favorited' : ''}`} />
								<Typography className="stat-text">12</Typography>
							</Stack>
						</Stack>

						<Stack className="action-buttons">
							<IconButton className="action-btn" onClick={() => setIsFavorited(!isFavorited)}>
								{isFavorited ? <FavoriteIcon className="favorited" /> : <FavoriteBorderIcon />}
							</IconButton>
							<IconButton className="action-btn">
								<BookmarkBorderIcon />
							</IconButton>
						</Stack>
					</Stack>
				</Stack>
			</div>
		);
	}
};

export default ProductCard;
