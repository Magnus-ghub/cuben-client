import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton, Avatar } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { Package, Calendar, Eye, Heart, Edit, Trash2, MoreVertical, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		initialInput || {
			page: 1,
			limit: 8,
			sort: 'createdAt',
			search: {
				memberId: '',
			},
		}
	);
	
	// Mock Data - Replace with real API data later
	const mockProducts: Product[] = [
		{
			_id: '1',
			productName: 'MacBook Pro M3 2023 - 14 inch',
			productPrice: 1500000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 245,
			productLikes: 34,
			createdAt: '2024-12-25T10:30:00Z',
		},
		{
			_id: '2',
			productName: 'Calculus Textbook Bundle with Solutions',
			productPrice: 45000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Hongdae, Seoul',
			productStatus: 'ACTIVE',
			productViews: 123,
			productLikes: 18,
			createdAt: '2024-12-23T14:20:00Z',
		},
		{
			_id: '3',
			productName: 'Custom Mechanical Keyboard RGB',
			productPrice: 180000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Itaewon, Seoul',
			productStatus: 'ACTIVE',
			productViews: 567,
			productLikes: 89,
			createdAt: '2024-12-20T09:15:00Z',
		},
		{
			_id: '4',
			productName: 'iPhone 15 Pro Max 256GB',
			productPrice: 1200000,
			productImages: ['/img/products/iphone1.jpg'],
			productLocation: 'Myeongdong, Seoul',
			productStatus: 'SOLD',
			productViews: 890,
			productLikes: 134,
			createdAt: '2024-12-18T16:45:00Z',
		},
		{
			_id: '5',
			productName: 'Sony WH-1000XM5 Headphones',
			productPrice: 320000,
			productImages: ['/img/products/headphones1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 456,
			productLikes: 67,
			createdAt: '2024-12-15T11:30:00Z',
		},
		{
			_id: '6',
			productName: 'Samsung 55 4K Smart TV',
			productPrice: 850000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Jamsil, Seoul',
			productStatus: 'ACTIVE',
			productViews: 234,
			productLikes: 43,
			createdAt: '2024-12-12T13:20:00Z',
		},
		{
			_id: '7',
			productName: 'Herman Miller Aeron Chair',
			productPrice: 980000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 178,
			productLikes: 29,
			createdAt: '2024-12-10T15:10:00Z',
		},
		{
			_id: '8',
			productName: 'iPad Pro 12.9 inch 2024',
			productPrice: 1100000,
			productImages: ['/img/product/macbookpro.jpeg'],
			productLocation: 'Sinchon, Seoul',
			productStatus: 'ACTIVE',
			productViews: 312,
			productLikes: 51,
			createdAt: '2024-12-08T10:45:00Z',
		},
	];
	
	const [agentProducts, setAgentProducts] = useState<Product[]>(mockProducts);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	// TODO: Add GraphQL query
	// const { data, loading, refetch } = useQuery(GET_MEMBER_PRODUCTS, {
	//   variables: { input: searchFilter },
	// });

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) {
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, memberId: memberId as string },
			});
		}
		// Set total count
		setTotal(mockProducts.length);
	}, [memberId]);

	useEffect(() => {
		// Simulate pagination
		const startIndex = (searchFilter.page - 1) * searchFilter.limit;
		const endIndex = startIndex + searchFilter.limit;
		setAgentProducts(mockProducts.slice(startIndex, endIndex));
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleProductClick = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const handleEditProduct = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=addNewProduct&productId=${productId}`);
	};

	const handleDeleteProduct = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// TODO: Implement delete functionality
		console.log('Delete product:', productId);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(price);
	};

	const getStatusColor = (status: string) => {
		const colors: { [key: string]: string } = {
			ACTIVE: '#10b981',
			SOLD: '#6b7280',
			DELETE: '#ef4444',
		};
		return colors[status] || '#94a3b8';
	};

	if (device === 'mobile') {
		return <div>MY PRODUCTS MOBILE</div>;
	}

	return (
		<Box className="modern-content-container">
			{/* Header Section */}
			<Stack className="content-header">
				<Box className="header-left">
					<Box className="title-icon">
						<Package size={24} />
					</Box>
					<Box>
						<h2 className="section-title">My Listings</h2>
						<p className="section-subtitle">Manage your product listings</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<Package size={16} />} label={`${total} Listings`} className="total-chip" />
				</Box>
			</Stack>

			{/* Products Grid */}
			<Box className="products-grid">
				{agentProducts?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Package size={64} />
						</Box>
						<h3>No Listings Yet</h3>
						<p>Start selling by adding your first product</p>
					</Box>
				) : (
					<>
						{agentProducts?.map((product: Product) => {
							const imagePath = '/img/product/macbookpro.jpeg';
							product?.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/product/macbookpro.jpeg';

							return (
								<Box
									key={product._id}
									className="product-card"
									onClick={() => handleProductClick(product._id)}
								>
									{/* Product Image */}
									<Box className="product-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="image-overlay">
											<Chip
												label={product.productStatus}
												size="small"
												className="status-chip"
												style={{
													background: getStatusColor(product.productStatus),
													color: '#ffffff',
												}}
											/>
										</Box>
										{product.productViews > 50 && (
											<Box className="trending-badge-img">
												<TrendingUp size={14} />
												<span>Hot</span>
											</Box>
										)}
									</Box>

									{/* Product Content */}
									<Box className="product-content">
										{/* Title & Location */}
										<Box className="product-header">
											<h3 className="product-title">{product.productName}</h3>
											{product.productLocation && (
												<Box className="product-location">
													<MapPin size={14} />
													<span>{product.productLocation}</span>
												</Box>
											)}
										</Box>

										{/* Price */}
										<Box className="product-price">
											<DollarSign size={18} />
											<span>{formatPrice(product.productPrice)}</span>
										</Box>

										{/* Stats Row */}
										<Stack className="product-stats">
											<Box className="stat-item">
												<Eye size={16} />
												<span>{product.productViews || 0}</span>
											</Box>
											<Box className="stat-item">
												<Heart size={16} />
												<span>{product.productLikes || 0}</span>
											</Box>
											<Box className="stat-item date">
												<Calendar size={16} />
												<span>{formatDate(product.createdAt)}</span>
											</Box>
										</Stack>

										{/* Action Buttons */}
										<Stack className="product-actions">
											<IconButton
												size="small"
												className="action-btn edit"
												onClick={(e) => handleEditProduct(product._id, e)}
											>
												<Edit size={16} />
											</IconButton>
											<IconButton
												size="small"
												className="action-btn delete"
												onClick={(e) => handleDeleteProduct(product._id, e)}
											>
												<Trash2 size={16} />
											</IconButton>
											<IconButton size="small" className="action-btn more">
												<MoreVertical size={16} />
											</IconButton>
										</Stack>
									</Box>
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{/* Pagination */}
			{agentProducts.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(total / searchFilter.limit)}
						page={searchFilter.page}
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

export default MyProducts;