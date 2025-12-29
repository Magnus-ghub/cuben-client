import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Heart, Package, Eye, Calendar, MapPin, DollarSign, Trash2, ShoppingCart } from 'lucide-react';
import { Product } from '../../libs/types/product/product';
import { REACT_APP_API_URL } from '../../libs/config';


const Favorites: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [searchFavorites, setSearchFavorites] = useState({ page: 1, limit: 8 });
	
	// Mock Data
	const mockFavorites: Product[] = [
		{
			_id: '1',
			productName: 'Vintage Leather Backpack',
			productPrice: 89000,
			productImages: ['/img/products/bag1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 456,
			productLikes: 78,
			createdAt: '2024-12-20T10:30:00Z',
		},
		{
			_id: '2',
			productName: 'Designer Sunglasses Collection',
			productPrice: 125000,
			productImages: ['/img/products/glasses1.jpg'],
			productLocation: 'Hongdae, Seoul',
			productStatus: 'ACTIVE',
			productViews: 234,
			productLikes: 45,
			createdAt: '2024-12-18T14:20:00Z',
		},
		{
			_id: '3',
			productName: 'Wireless Gaming Mouse',
			productPrice: 75000,
			productImages: ['/img/products/mouse1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 567,
			productLikes: 92,
			createdAt: '2024-12-15T09:15:00Z',
		},
		{
			_id: '4',
			productName: 'Minimalist Desk Lamp',
			productPrice: 55000,
			productImages: ['/img/products/lamp1.jpg'],
			productLocation: 'Sinchon, Seoul',
			productStatus: 'ACTIVE',
			productViews: 189,
			productLikes: 34,
			createdAt: '2024-12-12T16:45:00Z',
		},
	];

	const [myFavorites, setMyFavorites] = useState<Product[]>(mockFavorites);
	const [total, setTotal] = useState<number>(mockFavorites.length);

	useEffect(() => {
		// Simulate pagination
		const startIndex = (searchFavorites.page - 1) * searchFavorites.limit;
		const endIndex = startIndex + searchFavorites.limit;
		setMyFavorites(mockFavorites.slice(startIndex, endIndex));
	}, [searchFavorites]);

	const paginationHandler = (e: any, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const handleRemoveFavorite = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		console.log('Remove from favorites:', productId);
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
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	};

	if (device === 'mobile') {
		return <div>FAVORITES MOBILE</div>;
	}

	return (
		<Box className="saved-content-page">
			{/* Header */}
			<Stack className="content-header">
				<Box className="header-left">
					<Box className="title-icon">
						<Heart size={24} />
					</Box>
					<Box>
						<h2 className="section-title">My Favorites</h2>
						<p className="section-subtitle">Products you loved</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip 
						icon={<Heart size={16} />} 
						label={`${total} Items`} 
						className="total-chip" 
					/>
				</Box>
			</Stack>

			{/* Products Grid */}
			<Box className="saved-items-grid">
				{myFavorites?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Heart size={64} />
						</Box>
						<h3>No Favorites Yet</h3>
						<p>Start adding products you love to your favorites</p>
					</Box>
				) : (
					<>
						{myFavorites.map((product: Product) => {
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
										<Box className="favorite-badge">
											<Heart size={16} fill="#ec4899" color="#ec4899" />
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
											<Box className="stat-item date">
												<Calendar size={14} />
												<span>{formatDate(product.createdAt)}</span>
											</Box>
										</Stack>

										<Box className="item-actions">
											<IconButton
												size="small"
												className="remove-btn"
												onClick={(e) => handleRemoveFavorite(product._id, e)}
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
			{myFavorites.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(total / searchFavorites.limit)}
						page={searchFavorites.page}
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

export default withLayoutMain(Favorites);