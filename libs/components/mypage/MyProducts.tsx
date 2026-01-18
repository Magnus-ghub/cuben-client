import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { REMOVE_PRODUCT } from '../../apollo/user/mutation';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Package, Calendar, Eye, Heart, Edit, Trash2, MoreVertical, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction, Message } from '../../enums/common.enum';
import { sweetConfirmAlert, sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar); 
	
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		initialInput || {
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				memberId: '',
			},
		}
	);
	
	const [userProducts, setUserProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	

	/** APOLLO REQUESTS **/
	const [removeProduct] = useMutation(REMOVE_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		variables: { input: searchFilter },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		skip: !user?._id, 
		onCompleted: (data: T) => {
			setUserProducts(data?.getProducts?.list || []);
			setTotal(data.getProducts.metaCounter?.[0]?.total || 0);
		},
		onError: (error) => {
			console.error('MyProducts Error:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (user?._id) {
			setSearchFilter({
				...searchFilter,
				search: { ...searchFilter.search, memberId: user._id },
			});
		}
	}, [user?._id]);

	useEffect(() => {
		if (user?._id && searchFilter.search.memberId) {
			getProductsRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleProductClick = (productId: string) => {
		router.push(`/product/detail?id=${productId}`);
	};

	const handleEditProduct = (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// Fixed: Pass type and id parameters
		router.push(`/common/updateItem?type=product&id=${productId}`);
	};

	const handleDeleteProduct = async (productId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			const confirmed = await sweetConfirmAlert(
				'Are you sure you want to delete this product? This action cannot be undone.'
			);
			if (!confirmed) return;

			await removeProduct({
				variables: { input: productId },
			});

			await getProductsRefetch({ input: searchFilter });
			
			await sweetTopSmallSuccessAlert('Product deleted successfully!', 800);
		} catch (err: any) {
			console.error('Delete Product Error:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: 'KRW',
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

	if (!user?._id || getProductsLoading) {
		return (
			<Box className="modern-content-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading your products...</p>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>MY PRODUCTS MOBILE</div>;
	}

	return (
		<Box className="modern-content-container">
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

			<Box className="products-grid">
				{userProducts?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Package size={64} />
						</Box>
						<h3>No Listings Yet</h3>
						<p>Start selling by adding your first product</p>
					</Box>
				) : (
					<>
						{userProducts?.map((product: Product) => {
							const imagePath = product?.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/product/macbookpro.jpeg';

							return (
								<Box key={product._id} className="product-card" onClick={() => handleProductClick(product._id)}>
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

									<Box className="product-content">
										<Box className="product-header">
											<h3 className="product-title">{product.productName}</h3>
											{product.productAddress && (
												<Box className="product-location">
													<MapPin size={14} />
													<span>{product.productAddress}</span>
												</Box>
											)}
										</Box>

										<Box className="product-price">
											<DollarSign size={18} />
											<span>{formatPrice(product.productPrice)}</span>
										</Box>

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

										<Stack className="product-actions">
											<IconButton
												size="small"
												className="action-btn edit"
												onClick={(e) => handleEditProduct(product._id, e)}
												title="Edit Product"
											>
												<Edit size={16} />
											</IconButton>
											<IconButton
												size="small"
												className="action-btn delete"
												onClick={(e) => handleDeleteProduct(product._id, e)}
												title="Delete Product"
											>
												<Trash2 size={16} />
											</IconButton>
										</Stack>
									</Box>
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{userProducts.length > 0 && (
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

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			memberId: '',
		},
	},
};

export default MyProducts;