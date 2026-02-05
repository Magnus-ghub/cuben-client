import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useQuery, useReactiveVar } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Clock, Eye, Heart, Calendar, MapPin, Trash2, RefreshCw } from 'lucide-react';
import { Product } from '../../libs/types/product/product';
import { REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { GET_VISITED } from '../../libs/apollo/user/query';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import moment from 'moment';

const History: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchHistory, setSearchHistory] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchHistory,
		},
		notifyOnNetworkStatusChange: true,
		skip: !user?._id,
	});

	// 47-qatordan keyin qo'shing:
	useEffect(() => {
		if (getVisitedData?.getVisited) {
			console.log('Recently Viewed Data:', getVisitedData);
			setRecentlyViewed(getVisitedData.getVisited.list || []);
			setTotal(getVisitedData.getVisited.metaCounter?.[0]?.total || 0);
		}
	}, [getVisitedData]);

	useEffect(() => {
		if (getVisitedError) {
			console.error('History Query Error:', getVisitedError);
			sweetMixinErrorAlert('Error loading history: ' + getVisitedError.message);
		}
	}, [getVisitedError]);

	/** LIFECYCLE */
	useEffect(() => {
		if (user?._id) {
			getVisitedRefetch({ input: searchHistory });
		}
	}, [searchHistory, user?._id]);

	/** HANDLERS **/
	const paginationHandler = (event: React.ChangeEvent<unknown>, value: number) => {
		const newSearch = { ...searchHistory, page: value };
		setSearchHistory(newSearch);
	};

	const handleProductClick = (productId: string) => {
		router.push({
			pathname: '/product/detail',
			query: { id: productId },
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	const formatDate = (date: string) => {
		return moment(date).fromNow();
	};

	// Loading state
	if (getVisitedLoading) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
						<Clock size={48} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
						<Typography>Loading your history...</Typography>
					</Box>
				</Stack>
			</Box>
		);
	}

	// Error or not authenticated
	if (getVisitedError || !user?._id) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
					<Clock size={64} color="#667eea" />
					<Typography variant="h5">{getVisitedError ? 'An error occurred' : 'Please log in'}</Typography>
					<Typography color="text.secondary">
						{getVisitedError?.message || 'Log in to view your browsing history'}
					</Typography>
					{!user?._id && (
						<button
							onClick={() => router.push('/login')}
							style={{
								padding: '10px 20px',
								background: '#667eea',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: 'pointer',
							}}
						>
							Login
						</button>
					)}
				</Stack>
			</Box>
		);
	}

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
					<Chip icon={<Clock size={16} />} label={`${total} Item${total !== 1 ? 's' : ''}`} className="total-chip" />
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
						<button
							onClick={() => router.push('/product')}
							style={{
								marginTop: '20px',
								padding: '10px 20px',
								background: '#667eea',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: 'pointer',
							}}
						>
							Browse Products
						</button>
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
									style={{ cursor: 'pointer' }}
								>
									{/* Image */}
									<Box className="item-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="time-badge">
											<Clock size={12} />
											<span>{formatDate(product.createdAt.toString())}</span>
										</Box>
									</Box>

									{/* Content */}
									<Box className="item-content">
										<h3 className="item-title">{product.productName}</h3>

										{product.productAddress && (
											<Box className="item-location">
												<MapPin size={14} />
												<span>{product.productAddress}</span>
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
