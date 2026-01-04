import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Heart, Eye, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Product } from '../../libs/types/product/product';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT } from '../../libs/apollo/user/mutation';
import { GET_FAVORITES } from '../../libs/apollo/user/query';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

const Favorites: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [myFavorites, setMyFavorites] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFavorites,
		},
		notifyOnNetworkStatusChange: true,
		skip: !user?._id,
		onCompleted: (data: T) => {
			console.log('Favorites Data:', data); 
			setMyFavorites(data?.getFavorites?.list || []);
			setTotal(data?.getFavorites?.metaCounter?.[0]?.total || 0);
		},
		onError: (error) => {
			console.error('Favorites Query Error:', error); 
			sweetMixinErrorAlert('Error loading favorites: ' + error.message);
		},
	});

	/** LIFECYCLE */
	useEffect(() => {
		if (user?._id) {
			getFavoritesRefetch({ input: searchFavorites });
		}
	}, [searchFavorites, user?._id]); 

	/** HANDLERS **/
	const paginationHandler = (event: React.ChangeEvent<unknown>, value: number) => { 
		const newSearch = { ...searchFavorites, page: value };
		setSearchFavorites(newSearch);
	};

	// ✅ Unlike handler - Favorites dan o'chirish
	const handleRemoveFavorite = async (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		
		try {
			if (!user?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please log in!');
				return;
			}

			// Unlike qilish (toggle like)
			await likeTargetProduct({
				variables: {
					productId: productId,
				},
			});

			// Refetch favorites list
			await getFavoritesRefetch({ input: searchFavorites });
			sweetTopSmallSuccessAlert('Removed from favorites!', 800);
			
		} catch (err: any) {
			console.error('ERROR, handleRemoveFavorite:', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	// ✅ Product card bosilganda detail page ga o'tish
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
		return new Date(date).toLocaleDateString('en-US', { 
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	// Loading state
	if (getFavoritesLoading) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
						<Heart size={48} className="loading-heart" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
						<Typography>Loading your favorites...</Typography>
					</Box>
				</Stack>
			</Box>
		);
	}

	// Error or not authenticated
	if (getFavoritesError || !user?._id) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
					<Heart size={64} color="#ec4899" />
					<Typography variant="h5">
						{getFavoritesError ? 'An error occurred' : 'Please log in'}
					</Typography>
					<Typography color="text.secondary">
						{getFavoritesError?.message || 'Log in to view your favorites'}
					</Typography>
					{!user?._id && (
						<button 
							onClick={() => router.push('/login')}
							style={{
								padding: '10px 20px',
								background: '#ec4899',
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
						label={`${total} Item${total !== 1 ? 's' : ''}`}
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
						<button 
							onClick={() => router.push('/product')}
							style={{
								marginTop: '20px',
								padding: '10px 20px',
								background: '#ec4899',
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
						{myFavorites.map((product: Product) => {
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
										<img src={imagePath} alt={product.productTitle} />
										<Box className="favorite-badge">
											<Heart size={16} fill="#ec4899" color="#ec4899" />
										</Box>
									</Box>

									{/* Content */}
									<Box className="item-content">
										<h3 className="item-title">{product.productTitle}</h3>

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

										{/* ✅ Remove button */}
										<Box className="item-actions">
											<IconButton
												size="small"
												className="remove-btn"
												onClick={(e) => handleRemoveFavorite(product._id, e)}
												title="Remove from favorites"
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