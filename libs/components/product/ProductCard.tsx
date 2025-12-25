import React, { useState } from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const ProductCard = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="product-card">
      {/* Image Section */}
      <a href="/marketplace/detail" className="card-image-link">
        <div className="card-image-wrapper">
          <img 
            src="/img/product/macbookpro.jpeg" 
            alt="Product"
            className="card-image"
          />
          
          {/* Badges */}
          <Stack className="badge-container">
            <Stack className="featured-badge">
              <Typography component="p">Featured</Typography>
            </Stack>
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
          <a href="/marketplace/detail" className="card-title-link">
            <Typography className="card-title">
              Calculus Textbook Bundle with Solutions
            </Typography>
          </a>
          <Stack className="category-badge">
            <Typography component="p">BOOK</Typography>
          </Stack>
        </Stack>

        {/* Location */}
        <Stack className="card-location">
          <Typography className="location-text">
            📍 Main Library, 2nd Floor
          </Typography>
        </Stack>

        {/* Seller Section */}
        <Stack className="seller-section">
          <Stack className="seller-info">
            <Avatar 
              src="/img/user/default.png"
              alt="Seller"
              className="seller-avatar"
            />
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
            <IconButton 
              className="action-btn"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              {isFavorited ? (
                <FavoriteIcon className="favorited" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton className="action-btn">
              <BookmarkBorderIcon />
            </IconButton>
            <IconButton className="action-btn">
              <ShareIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <style jsx>{`
        .product-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          height: auto;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.12);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .product-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-image-link {
          display: block;
          text-decoration: none;
          cursor: pointer;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .badge-container {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .featured-badge {
          padding: 6px 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .featured-badge p {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          margin: 0;
        }

        .condition-badge {
          padding: 6px 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .condition-badge p {
          font-size: 10px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          margin: 0;
        }

        .price-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 2;
        }

        .price {
          font-size: 18px;
          font-weight: 800;
          color: #1f2937;
          letter-spacing: -0.3px;
          line-height: 1;
        }

        .card-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-title-link {
          text-decoration: none;
          display: block;
        }

        .card-title {
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: color 0.2s ease;
          min-height: 39px;
        }

        .card-title:hover {
          color: #667eea;
        }

        .category-badge {
          display: inline-flex;
          width: fit-content;
          padding: 4px 10px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 6px;
        }

        .category-badge p {
          font-size: 11px;
          font-weight: 700;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          margin: 0;
        }

        .card-location {
          display: flex;
        }

        .location-text {
          font-size: 13px;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .seller-section {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }

        .seller-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .seller-avatar {
          width: 32px !important;
          height: 32px !important;
          border: 2px solid #e5e7eb;
        }

        .seller-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .seller-name {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .post-time {
          font-size: 10px;
          font-weight: 400;
          color: #9ca3af;
          line-height: 1.2;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .status-badge.available {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge p {
          font-size: 11px;
          font-weight: 700;
          color: #10b981;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
          margin: 0;
        }

        .card-actions {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #f3f4f6;
        }

        .stats {
          display: flex;
          flex-direction: row;
          gap: 12px;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 4px;
        }

        .stat-icon {
          width: 16px;
          height: 16px;
          color: #9ca3af;
        }

        .stat-icon.favorited {
          color: #ef4444;
        }

        .stat-text {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          line-height: 1;
        }

        .action-buttons {
          display: flex;
          flex-direction: row;
          gap: 2px;
        }

        .action-btn {
          width: 32px !important;
          height: 32px !important;
          padding: 6px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f3f4f6 !important;
        }

        .action-btn svg {
          width: 18px;
          height: 18px;
          color: #6b7280;
        }

        .action-btn svg.favorited {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;