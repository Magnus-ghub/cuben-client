import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton, Tabs, Tab, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../libs/apollo/store';
import { Bookmark, Package, Eye, Heart, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { Product } from '../../libs/types/product/product';
import { GET_SAVED_PRODUCTS } from '../../libs/apollo/user/query';
import { SAVE_TARGET_PRODUCT } from '../../libs/apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import moment from 'moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SavedItems: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchSaved, setSearchSaved] = useState<T>({ page: 1, limit: 8 });
	const [savedProducts, setSavedProducts] = useState<Product[]>([]);
	const [totalProducts, setTotalProducts] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [saveTargetProduct] = useMutation(SAVE_TARGET_PRODUCT);

	const {
		loading: getSavedProductsLoading,
		data: getSavedProductsData,
		error: getSavedProductsError,
		refetch: getSavedProductsRefetch,
	} = useQuery(GET_SAVED_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchSaved },
		notifyOnNetworkStatusChange: true,
		skip: !user?._id,
		onCompleted: (data: T) => {
			console.log('Saved Products Data:', data);
			setSavedProducts(data?.getSavedProducts?.list || []);
			setTotalProducts(data?.getSavedProducts?.metaCounter?.[0]?.total || 0);
		},
		onError: (error) => {
			console.error('Saved Products Error:', error);
			sweetMixinErrorAlert('Error loading saved products: ' + error.message);
		},
	});

	/** LIFECYCLE **/
	useEffect(() => {
		if (user?._id) {
			getSavedProductsRefetch({ input: searchSaved });
		}
	}, [searchSaved, user?._id]);

	/** HANDLERS **/
	const paginationHandler = (event: React.ChangeEvent<unknown>, value: number) => {
		setSearchSaved({ ...searchSaved, page: value });
	};

	const handleRemoveProduct = async (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		
		try {
			if (!user?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please log in!');
				return;
			}

			await saveTargetProduct({
				variables: { productId: productId },
			});

			await getSavedProductsRefetch({ input: searchSaved });
			sweetTopSmallSuccessAlert('Removed from saved items!', 800);
			
		} catch (err: any) {
			console.error('ERROR, handleRemoveProduct:', err.message);
			sweetMixinErrorAlert(err.message);
		}
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
		return moment(date).format('MMM D, YYYY');
	};

	// Loading state
	if (getSavedProductsLoading) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
						<Bookmark size={48} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
						<Typography>Loading saved items...</Typography>
					</Box>
				</Stack>
			</Box>
		);
	}

	// Error or not authenticated
	if (!user?._id) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
					<Bookmark size={64} color="#667eea" />
					<Typography variant="h5">Please log in</Typography>
					<Typography color="text.secondary">Log in to view your saved items</Typography>
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
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>SAVED ITEMS MOBILE</div>;
	}

	return (
		<Box className="saved-content-page">
			{/* Header */}
			<Stack className="content-header">
				<Box className="header-left">
					<Box className="title-icon saved">
						<Bookmark size={24} />
					</Box>
					<Box>
						<h2 className="section-title">Saved Items</h2>
						<p className="section-subtitle">Your bookmarked products</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip
						icon={<Bookmark size={16} />}
						label={`${totalProducts} Item${totalProducts !== 1 ? 's' : ''}`}
						className="total-chip"
					/>
				</Box>
			</Stack>

			{/* Content Grid */}
			<Box className="saved-items-grid">
				{savedProducts?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Bookmark size={64} />
						</Box>
						<h3>No Saved Items</h3>
						<p>Save products to view them here</p>
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
						{savedProducts.map((product: Product) => {
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
									<Box className="item-image">
										<img src={imagePath} alt={product.productTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#667eea" color="#667eea" />
										</Box>
									</Box>

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

										<Box className="item-actions">
											<IconButton
												size="small"
												className="remove-btn"
												onClick={(e) => handleRemoveProduct(product._id, e)}
												title="Remove from saved"
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
			{savedProducts.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(totalProducts / searchSaved.limit)}
						page={searchSaved.page}
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

export default withLayoutMain(SavedItems);