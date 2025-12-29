import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Clock, Eye, Heart, Calendar, MapPin, Trash2, RefreshCw } from 'lucide-react';
import { Product } from '../../libs/types/product/product';
import { REACT_APP_API_URL } from '../../libs/config';
import { ProductLocation } from '../../libs/enums/product.enum';

const History: NextPage = () => {
	const device = useDeviceDetect();
    const [productLocation, setProductLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [searchHistory, setSearchHistory] = useState({ page: 1, limit: 8 });
	
	// Mock Data - Recently Viewed
	const History: Product[] = [
		{
			_id: '1',
			productName: 'Apple AirPods Pro 2nd Gen',
			productPrice: 289000,
			productImages: ['/img/products/airpods1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 1234,
			productLikes: 234,
			createdAt: '2024-12-28T15:30:00Z',
		},
		{
			_id: '2',
			productName: 'Nike Air Jordan 1 Retro',
			productPrice: 180000,
			productImages: ['/img/products/shoes1.jpg'],
			productLocation: 'Myeongdong, Seoul',
			productStatus: 'ACTIVE',
			productViews: 890,
			productLikes: 167,
			createdAt: '2024-12-28T12:15:00Z',
		},
		{
			_id: '3',
			productName: 'LG UltraWide Monitor 34"',
			productPrice: 650000,
			productImages: ['/img/products/monitor1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 456,
			productLikes: 89,
			createdAt: '2024-12-27T18:45:00Z',
		},
		{
			_id: '4',
			productName: 'Kindle Paperwhite 2024',
			productPrice: 150000,
			productImages: ['/img/products/kindle1.jpg'],
			productLocation: 'Hongdae, Seoul',
			productStatus: 'ACTIVE',
			productViews: 678,
			productLikes: 123,
			createdAt: '2024-12-27T10:20:00Z',
		},
		{
			_id: '5',
			productName: 'Dyson V15 Vacuum Cleaner',
			productPrice: 890000,
			productImages: ['/img/products/vacuum1.jpg'],
			productLocation: 'Jamsil, Seoul',
			productStatus: 'ACTIVE',
			productViews: 345,
			productLikes: 67,
			createdAt: '2024-12-26T14:30:00Z',
		},
	];

	const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(mockRecentlyViewed);
	const [total, setTotal] = useState<number>(mockRecentlyViewed.length);

	useEffect(() => {
		// Simulate pagination
		const startIndex = (searchHistory.page - 1) * searchHistory.limit;
		const endIndex = startIndex + searchHistory.limit;
		setRecentlyViewed(mockRecentlyViewed.slice(startIndex, endIndex));
	}, [searchHistory]);

	const paginationHandler = (e: any, value: number) => {
		setSearchHistory({ ...searchHistory, page: value });
	};

	const handleClearHistory = () => {
		console.log('Clear all history');
		// TODO: Implement clear all functionality
	};

	const handleRemoveItem = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		console.log('Remove from history:', productId);
		// TODO: Implement remove functionality
	};

	const handleProductClick = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: 'KRW',
		}).format(price);
	};

	const formatDate = (date: string) => {
		const now = new Date();
		const viewDate = new Date(date);
		const diffHours = Math.floor((now.getTime() - viewDate.getTime()) / (1000 * 60 * 60));
		
		if (diffHours < 1) return 'Just now';
		if (diffHours < 24) return `${diffHours}h ago`;
		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	};

	if (device === 'mobile') {
		return <div>RECENTLY VIEWED MOBILE</div>;
	}

	return (
		<Box className="saved-content-page">
			{/* Header */}
			<Stack className="content-header">
				<Box className="header-left">
					<Box className="title-icon history">
						<Clock size={24} />
					</Box>
					<Box>
						<h2 className="section-title">Recently Viewed</h2>
						<p className="section-subtitle">Your browsing history</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip 
						icon={<Clock size={16} />} 
						label={`${total} Items`} 
						className="total-chip" 
					/>
					<IconButton 
						className="clear-btn"
						onClick={handleClearHistory}
					>
						<RefreshCw size={18} />
					</IconButton>
				</Box>
			</Stack>

			{/* Products Grid */}
			<Box className="saved-items-grid">
				{recentlyViewed?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Clock size={64} />
						</Box>
						<h3>No Recent Views</h3>
						<p>Products you view will appear here</p>
					</Box>
				) : (
					<>
						{recentlyViewed.map((product: Product) => {
							const imagePath = product?.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/banner/product.webp';

							return (
								<Box
									key={product._id}
									className="saved-item-card"
									onClick={() => handleProductClick(product._id)}
								>
									{/* Image */}
									<Box className="item-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="time-badge">
											<Clock size={12} />
											<span>{formatDate(product.createdAt)}</span>
										</Box>
									</Box>

									{/* Content */}
									<Box className="item-content">
										<h3 className="item-title">{product.productName}</h3>
										
										{product.productLocation && (
											<Box className="item-location">
												<MapPin size={14} />
												<span>{product.productLocation}</span>
											</Box>
										)}

										<Box className="item-price">
											<span>{formatPrice(product.productPrice)}</span>
										</Box>

										<Stack className="item-stats">
											<Box className="stat-item">
												<Eye size={14} />
												<span>{product.productViews}</span>
											</Box>
											<Box className="stat-item">
												<Heart size={14} />
												<span>{product.productLikes}</span>
											</Box>
										</Stack>

										<Box className="item-actions">
											<IconButton
												size="small"
												className="remove-btn"
												onClick={(e) => handleRemoveItem(product._id, e)}
											>
												<Trash2 size={16} />
											</IconButton>
										</Box>
									</Box>
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{/* Pagination */}
			{recentlyViewed.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(total / searchHistory.limit)}
						page={searchHistory.page}
						shape="rounded"
						color="primary"
						size="large"
						className="pagination-control"
						onChange={paginationHandler}
					/>
				</Stack>
			)}
		</Box>
	);
};

export default withLayoutMain(History);