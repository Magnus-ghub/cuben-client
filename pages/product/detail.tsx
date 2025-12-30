import React, { useState } from 'react';
import { Container, Stack, Box, Typography, IconButton, Avatar, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';

const MarketplaceDetail = () => {
	const device = useDeviceDetect();
	const [isFavorited, setIsFavorited] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [selectedImage, setSelectedImage] = useState('/img/product/macbookpro.jpeg');

	const productImages = [
		'/img/product/macbookpro.jpeg',
		'/img/product/macbookpro.jpeg',
		'/img/product/macbookpro.jpeg',
		'/img/product/macbookpro.jpeg',
	];

	if (device === 'mobile') {
		return <Container>MARKETPLACE DETAIL MOBILE</Container>;
	} else {
		return (
			<div id="marketplace-detail-page">
				<Container className="detail-container">
					{/* Breadcrumb */}
					<Stack className="breadcrumb">
						<Typography className="crumb">Marketplace</Typography>
						<Typography className="separator">/</Typography>
						<Typography className="crumb">Electronics</Typography>
						<Typography className="separator">/</Typography>
						<Typography className="crumb active">MacBook Pro M3 2023</Typography>
					</Stack>

					<Stack className="detail-layout">
						{/* LEFT COLUMN */}
						<Stack className="left-column">
							{/* Image Gallery */}
							<Stack className="image-gallery">
								<Box className="main-image">
									<img src={selectedImage} alt="Product" />
									<Stack className="image-badges">
										<Chip label="LIKE NEW" className="condition-chip" />
									</Stack>
								</Box>
								<Stack className="thumbnail-list">
									{productImages.map((img, idx) => (
										<Box
											key={idx}
											className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
											onClick={() => setSelectedImage(img)}
										>
											<img src={img} alt={`Thumbnail ${idx + 1}`} />
										</Box>
									))}
								</Stack>
							</Stack>

							{/* Description */}
							<Stack className="description-section">
								<Typography className="section-title">Description</Typography>
								<Typography className="description-text">
									Brand new MacBook Pro M3 2023 with 16GB RAM and 512GB SSD. 
									Perfect condition, barely used for 2 months. Comes with original box, 
									charger, and all accessories. Great for students and professionals 
									who need powerful performance for coding, design, and multimedia work.
									No scratches or damages. Still under warranty.
								</Typography>
							</Stack>

							{/* Product Details */}
							<Stack className="details-section">
								<Typography className="section-title">Product Details</Typography>
								<Stack className="details-grid">
									<Stack className="detail-row">
										<Typography className="detail-label">Category</Typography>
										<Typography className="detail-value">Electronics</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Condition</Typography>
										<Typography className="detail-value">Like New</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Brand</Typography>
										<Typography className="detail-value">Apple</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Status</Typography>
										<Typography className="detail-value available">Available</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Views</Typography>
										<Typography className="detail-value">245</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Posted</Typography>
										<Typography className="detail-value">2 days ago</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Meetup Location */}
							<Stack className="location-section">
								<Typography className="section-title">Meetup Location</Typography>
								<Stack className="location-card">
									<LocationOnIcon className="location-icon" />
									<Stack className="location-info">
										<Typography className="location-name">Main Library</Typography>
										<Typography className="location-detail">
											2nd Floor, Near Main Entrance
										</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>

						{/* RIGHT COLUMN (SIDEBAR) */}
						<Stack className="right-column">
							{/* Product Header */}
							<Stack className="product-header">
								<Typography className="product-title">
									MacBook Pro M3 2023 - 16GB RAM
								</Typography>
								<Stack className="product-meta">
									<Chip label="ELECTRONICS" className="category-chip" />
									<Typography className="post-date">Posted 2 days ago</Typography>
								</Stack>
							</Stack>

							{/* Price & Actions */}
							<Stack className="price-section">
								<Stack className="price-row">
									<Typography className="price">₩1,500,000</Typography>
									<Stack className="action-icons">
										<IconButton
											className="action-icon"
											onClick={() => setIsFavorited(!isFavorited)}
										>
											{isFavorited ? (
												<FavoriteIcon className="favorited" />
											) : (
												<FavoriteBorderIcon />
											)}
										</IconButton>
										<IconButton
											className="action-icon"
											onClick={() => setIsSaved(!isSaved)}
										>
											{isSaved ? (
												<BookmarkIcon style={{ color: '#667eea' }} />
											) : (
												<BookmarkBorderIcon />
											)}
										</IconButton>
									</Stack>
								</Stack>
								<Stack className="stats-row">
									<Stack className="stat">
										<RemoveRedEyeIcon />
										<Typography>245 views</Typography>
									</Stack>
									<Stack className="stat">
										<FavoriteIcon className="favorited" />
										<Typography>{isFavorited ? 13 : 12} likes</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Seller Card */}
							<Stack className="seller-card">
								<Typography className="card-title">Seller Information</Typography>
								<Stack className="seller-profile">
									<Avatar
										src="/img/profile/user1.jpg"
										alt="John Doe"
										className="seller-avatar"
									/>
									<Stack className="seller-info">
										<Stack className="seller-name-row">
											<Typography className="seller-name">John Doe</Typography>
											<VerifiedIcon className="verified-icon" />
										</Stack>
										<Typography className="seller-username">@johndoe</Typography>
										<Typography className="seller-listings">
											5 active listings
										</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Contact Form */}
							<Stack className="contact-card">
								<Typography className="card-title">Contact Seller</Typography>
								<Stack className="form-group">
									<Typography className="input-label">Your Name</Typography>
									<input
										type="text"
										placeholder="Enter your name"
										className="form-input"
									/>
								</Stack>
								<Stack className="form-group">
									<Typography className="input-label">Message</Typography>
									<textarea
										placeholder="Hi, I'm interested in this item..."
										className="form-textarea"
										rows={4}
									/>
								</Stack>
								<button className="send-button">
									<Typography component="p">Send Message</Typography>
								</button>
							</Stack>
						</Stack>
					</Stack>
				</Container>
			</div>
		);
	}
};

MarketplaceDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		search: {
			productId: '',
		},
	},
};

export default withLayoutMain(MarketplaceDetail);