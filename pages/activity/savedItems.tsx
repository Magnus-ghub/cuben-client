import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Chip, Tabs, Tab, Pagination, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../libs/apollo/store';
import { Bookmark, Eye, Heart, Calendar, MapPin, Trash2, MessageSquare } from 'lucide-react';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { Product } from '../../libs/types/product/product';
import { Post } from '../../libs/types/post/post';
import { GET_SAVED_PRODUCTS, GET_SAVED_POSTS } from '../../libs/apollo/user/query';
import { SAVE_TARGET_PRODUCT, SAVE_TARGET_POST } from '../../libs/apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import CommentModal from '../../libs/components/common/CommentModal';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

const SavedItems: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [searchParams, setSearchParams] = useState<T>({ page: 1, limit: 6 });
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	/** APOLLO REQUESTS **/
	const [saveTargetProduct] = useMutation(SAVE_TARGET_PRODUCT);
	const [saveTargetPost] = useMutation(SAVE_TARGET_POST);

	// Products Query
	const {
		loading: productsLoading,
		data: productsData,
		refetch: refetchProducts,
		error: productsError,
	} = useQuery(GET_SAVED_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
	});

	// Posts Query
	const {
		loading: postsLoading,
		data: postsData,
		refetch: refetchPosts,
		error: postsError,
	} = useQuery(GET_SAVED_POSTS, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchParams, search: {} } },
		skip: !user?._id,
	});

	// Derived state from query data
	const savedProducts: Product[] = productsData?.getSavedProducts?.list || [];
	const savedPosts: Post[] = postsData?.getSavedPosts?.list || [];
	const totals = {
		products: productsData?.getSavedProducts?.metaCounter?.[0]?.total || 0,
		posts: postsData?.getSavedPosts?.metaCounter?.[0]?.total || 0,
	};

	// Error handling with useEffect
	useEffect(() => {
		if (productsError) {
			console.error('Products Error:', productsError);
			sweetMixinErrorAlert('Error loading products: ' + productsError.message);
		}
	}, [productsError]);

	useEffect(() => {
		if (postsError) {
			console.error('Posts Error:', postsError);
		}
	}, [postsError]);

	/** LIFECYCLE **/
	useEffect(() => {
		if (user?._id) {
			if (activeTab === 0) refetchProducts({ input: searchParams });
			else if (activeTab === 1) refetchPosts({ input: { ...searchParams, search: {} } });
		}
	}, [searchParams, activeTab, user?._id, refetchProducts, refetchPosts]);

	/** HANDLERS **/
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setSearchParams({ page: 1, limit: 6 });
	};

	const paginationHandler = (event: React.ChangeEvent<unknown>, value: number) => {
		setSearchParams({ ...searchParams, page: value });
	};

	const handleCommentAdded = async () => {
		try {
			// Refetch saved posts to update comment counts after adding a comment
			if (activeTab === 1 && user?._id) {
				await refetchPosts({ input: { ...searchParams, search: {} } });
			}
			setCommentModalOpen(false);
		} catch (err) {
			console.error('Error refetching saved posts:', err);
		}
	};

	const handleRemoveItem = async (itemId: string, type: 'product' | 'post', e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			if (!user?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please log in!');
				return;
			}

			if (type === 'product') {
				await saveTargetProduct({ variables: { productId: itemId } });
				await refetchProducts({ input: searchParams });
			} else if (type === 'post') {
				await saveTargetPost({ variables: { input: itemId } });
				await refetchPosts({ input: { ...searchParams, search: {} } });
			}

			sweetTopSmallSuccessAlert('Removed from saved items!', 800);
		} catch (err: any) {
			console.error('ERROR, handleRemoveItem:', err.message);
			sweetMixinErrorAlert(err.message || 'Failed to remove item');
		}
	};

	const handleItemClick = (itemId: string, type: 'product' | 'post') => {
		const routes = {
			product: '/product/detail',
			post: '/community/detail',
		};
		router.push({ pathname: routes[type], query: { id: itemId } });
	};

	const handlePostClick = (post: Post) => {
		console.log('Comment clicked for post:', post._id);
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const isLoading = productsLoading || postsLoading;
	const currentTotal = [totals.products, totals.posts][activeTab];

	if (isLoading && searchParams.page === 1) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
						<Bookmark size={48} style={{ animation: 'pulse 1.5s ease-in-out infinite', color: '#10b981' }} />
						<Typography variant="body1" color="text.secondary">
							Loading saved items...
						</Typography>
					</Box>
				</Stack>
			</Box>
		);
	}

	if (!user?._id) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
					<Bookmark size={64} color="#10b981" />
					<Typography variant="h5">Please log in</Typography>
					<Typography color="text.secondary">Log in to view your saved items</Typography>
					<button
						onClick={() => router.push('/login')}
						style={{
							padding: '12px 24px',
							background: '#10b981',
							color: 'white',
							border: 'none',
							borderRadius: '8px',
							cursor: 'pointer',
							fontSize: '14px',
							fontWeight: 600,
						}}
					>
						Login
					</button>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return (
			<Box className="saved-content-page">
				<Typography variant="h6" textAlign="center" mt={4}>
					Mobile version coming soon...
				</Typography>
			</Box>
		);
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
						<p className="section-subtitle">Your bookmarked content</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip
						icon={<Bookmark size={16} />}
						label={`${currentTotal} Item${currentTotal !== 1 ? 's' : ''}`}
						className="total-chip"
					/>
				</Box>
			</Stack>

			{/* Tabs */}
			<Box className="tabs-container">
				<Tabs value={activeTab} onChange={handleTabChange} className="custom-tabs">
					<Tab
						label={
							<Box className="tab-label">
								<Bookmark size={16} />
								<span>Products ({totals.products})</span>
							</Box>
						}
					/>
					<Tab
						label={
							<Box className="tab-label">
								<MessageSquare size={16} />
								<span>Posts ({totals.posts})</span>
							</Box>
						}
					/>
				</Tabs>
			</Box>

			{/* Products Tab */}
			<TabPanel value={activeTab} index={0}>
				<Box className="saved-items-grid">
					{savedProducts.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon">
								<Bookmark size={64} />
							</Box>
							<h3>No Saved Products</h3>
							<p>Start bookmarking products</p>
							<button
								onClick={() => router.push('/product')}
								style={{
									marginTop: '20px',
									padding: '12px 24px',
									background: '#10b981',
									color: 'white',
									border: 'none',
									borderRadius: '8px',
									cursor: 'pointer',
									fontSize: '14px',
									fontWeight: 600,
								}}
							>
								Browse Products
							</button>
						</Box>
					) : (
						savedProducts.map((product: Product) => {
							const imagePath = product?.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/banner/product.webp';
							return (
								<Box
									key={product._id}
									className="saved-item-card"
									onClick={() => handleItemClick(product._id, 'product')}
									style={{ cursor: 'pointer' }}
								>
									<Box className="item-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#10b981" color="#10b981" />
										</Box>
									</Box>
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
												<span>{product.productViews || 0}</span>
											</Box>
											<Box className="stat-item">
												<Heart size={14} />
												<span>{product.productLikes || 0}</span>
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
												onClick={(e) => handleRemoveItem(product._id, 'product', e)}
												title="Remove"
											>
												<Trash2 size={16} />
											</IconButton>
										</Box>
									</Box>
								</Box>
							);
						})
					)}
				</Box>
			</TabPanel>

			{/* Posts Tab */}
			<TabPanel value={activeTab} index={1}>
				<Box className="saved-items-grid">
					{savedPosts.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon">
								<MessageSquare size={64} />
							</Box>
							<h3>No Saved Posts</h3>
							<p>Start bookmarking posts</p>
							<button
								onClick={() => router.push('/')}
								style={{
									marginTop: '20px',
									padding: '12px 24px',
									background: '#10b981',
									color: 'white',
									border: 'none',
									borderRadius: '8px',
									cursor: 'pointer',
									fontSize: '14px',
									fontWeight: 600,
								}}
							>
								Browse Community
							</button>
						</Box>
					) : (
						savedPosts.map((post: Post) => {
							const imagePath = post?.postImages?.[0]
								? `${REACT_APP_API_URL}/${post.postImages[0]}`
								: '/img/banner/post.webp';
							return (
								<Box
									key={post._id}
									className="post-card"
									onClick={() => handlePostClick(post)}
									style={{ cursor: 'pointer' }}
								>
									{/* Post Image */}
									<Box className="post-image">
										<img src={imagePath} alt={post.postTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#10b981" color="#10b981" />
										</Box>
									</Box>

									{/* Post Content */}
									<Box className="post-content">
										<h3 className="post-title">{post.postTitle}</h3>
										<p className="post-description">
											{post.postContent?.substring(0, 120)}
											{post.postContent?.length > 120 && '...'}
										</p>

										{/* Stats Row */}
										<Stack className="post-stats">
											<Box className="stat-item">
												<Heart size={16} />
												<span>{post.postLikes || 0}</span>
											</Box>
											<Box className="stat-item">
												<MessageSquare size={16} />
												<span>{post.postComments || 0}</span>
											</Box>
											<Box className="stat-item date">
												<Calendar size={16} />
												<span>{formatDate(post.createdAt)}</span>
											</Box>
										</Stack>

										{/* Action Buttons */}
										<Stack className="post-actions">
											<IconButton
												size="small"
												className="action-btn remove-btn"
												onClick={(e) => handleRemoveItem(post._id, 'post', e)}
												title="Remove"
											>
												<Trash2 size={16} />
											</IconButton>
										</Stack>
									</Box>
								</Box>
							);
						})
					)}
				</Box>
			</TabPanel>

			{/* Pagination */}
			{currentTotal > searchParams.limit && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(currentTotal / searchParams.limit)}
						page={searchParams.page}
						shape="rounded"
						color="primary"
						size="large"
						className="pagination-control"
						onChange={paginationHandler}
					/>
				</Stack>
			)}

			<CommentModal
				open={commentModalOpen}
				onClose={() => setCommentModalOpen(false)}
				post={selectedPost}
				onCommentAdded={handleCommentAdded}
			/>
		</Box>
	);
};

export default withLayoutMain(SavedItems);