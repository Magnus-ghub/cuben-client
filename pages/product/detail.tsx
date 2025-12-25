import { Container, Stack, Box, Typography, IconButton, Avatar, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import withLayoutMain from "../../libs/components/layout/LayoutHome";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import React from "react";

const MarketplaceDetail = () => {
    const device = useDeviceDetect();
    const [isFavorited, setIsFavorited] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState("/img/banner/header1.svg");

    const thumbnails = [
        "/img/product/macbookpro.jpeg",
        "/img/product/macbookpro.jpeg",
        "/img/product/macbookpro.jpeg",
    ];

    if (device === "mobile") {
        return <Container>MARKETPLACE DETAIL MOBILE</Container>
    } else {
        return (
            <div id="marketplace-detail-page">
                <Container className="detail-container">
                    {/* Breadcrumb */}
                    <Stack className="breadcrumb">
                        <Typography className="crumb">Marketplace</Typography>
                        <Typography className="separator">/</Typography>
                        <Typography className="crumb">Books</Typography>
                        <Typography className="separator">/</Typography>
                        <Typography className="crumb active">Calculus Textbook Bundle</Typography>
                    </Stack>

                    <Stack className="detail-layout">
                        {/* LEFT COLUMN - Images & Details */}
                        <Stack className="left-column">
                            {/* Image Gallery */}
                            <Stack className="image-gallery">
                                <Box className="main-image">
                                    <img src={selectedImage} alt="Product" />
                                    <Stack className="image-badges">
                                        <Chip label="FEATURED" className="featured-chip" />
                                        <Chip label="LIKE NEW" className="condition-chip" />
                                    </Stack>
                                </Box>
                                <Stack className="thumbnail-list">
                                    {thumbnails.map((thumb, idx) => (
                                        <Box 
                                            key={idx}
                                            className={`thumbnail ${selectedImage === thumb ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(thumb)}
                                        >
                                            <img src={thumb} alt={`Thumbnail ${idx + 1}`} />
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>

                            {/* Product Description */}
                            <Stack className="description-section">
                                <Typography className="section-title">Description</Typography>
                                <Typography className="description-text">
                                    Complete Calculus textbook bundle including main textbook, 
                                    solution manual, and practice workbook. All books are in 
                                    excellent condition with minimal highlighting. Perfect for 
                                    students taking MATH 201 or MATH 301.
                                </Typography>
                            </Stack>

                            {/* Product Details */}
                            <Stack className="details-section">
                                <Typography className="section-title">Product Details</Typography>
                                <Stack className="details-grid">
                                    <Stack className="detail-row">
                                        <Typography className="detail-label">Category</Typography>
                                        <Typography className="detail-value">BOOK</Typography>
                                    </Stack>
                                    <Stack className="detail-row">
                                        <Typography className="detail-label">Condition</Typography>
                                        <Typography className="detail-value">Like New</Typography>
                                    </Stack>
                                    <Stack className="detail-row">
                                        <Typography className="detail-label">Type</Typography>
                                        <Typography className="detail-value">Educational</Typography>
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
                                        <Typography className="location-detail">2nd Floor, Near Entrance</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        {/* RIGHT COLUMN - Sidebar */}
                        <Stack className="right-column">
                            {/* Product Header */}
                            <Stack className="product-header">
                                <Typography className="product-title">
                                    Calculus Textbook Bundle
                                </Typography>
                                <Stack className="product-meta">
                                    <Chip label="BOOK" className="category-chip" />
                                    <Typography className="post-date">Posted 2 days ago</Typography>
                                </Stack>
                            </Stack>

                            {/* Price & Actions */}
                            <Stack className="price-section">
                                <Stack className="price-row">
                                    <Typography className="price">₩45,000</Typography>
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
                                        <IconButton className="action-icon">
                                            <BookmarkBorderIcon />
                                        </IconButton>
                                        <IconButton className="action-icon">
                                            <ShareIcon />
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
                                        <Typography>12 likes</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>

                            {/* Seller Card */}
                            <Stack className="seller-card">
                                <Typography className="card-title">Seller Information</Typography>
                                <Stack className="seller-profile">
                                    <Avatar 
                                        src="/img/user/default.png" 
                                        alt="John Doe"
                                        className="seller-avatar"
                                    />
                                    <Stack className="seller-info">
                                        <Stack className="seller-name-row">
                                            <Typography className="seller-name">John Doe</Typography>
                                            <VerifiedIcon className="verified-icon" />
                                        </Stack>
                                        <Typography className="seller-username">@johndoe</Typography>
                                        <Typography className="seller-listings">5 active listings</Typography>
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
                                    <Typography>Send Message</Typography>
                                </button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </div>
        );
    } 
};

export default withLayoutMain(MarketplaceDetail);