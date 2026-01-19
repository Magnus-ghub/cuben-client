import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Chip, Tabs, Tab, Pagination, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { Heart, Eye, Calendar, MapPin, Trash2, MessageSquare, FileText } from 'lucide-react';
import { Product } from '../../libs/types/product/product';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT, LIKE_TARGET_POST, LIKE_TARGET_ARTICLE } from '../../libs/apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { GET_FAVORITE_PRODUCTS, GET_FAVORITE_POSTS, GET_FAVORITE_ARTICLES } from '../../libs/apollo/user/query';
import moment from 'moment';
import { Post } from '../../libs/types/post/post';
import { Article } from '../../libs/types/article/article';

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

const Favorites: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [searchParams, setSearchParams] = useState<T>({ page: 1, limit: 6 });

	// States for each content type
	const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
	const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
	const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
	const [totals, setTotals] = useState({ products: 0, posts: 0, articles: 0 });

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);
	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);

	// Products Query
	const {
		loading: productsLoading,
		refetch: refetchProducts,
	} = useQuery(GET_FAVORITE_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setFavoriteProducts(data?.getLikedProducts?.list || []);
			setTotals((prev) => ({ ...prev, products: data?.getLikedProducts?.metaCounter?.[0]?.total || 0 }));
		},
		onError: (error) => {
			console.error('Products Error:', error);
			sweetMixinErrorAlert('Error loading products: ' + error.message);
		},
	});

	// Posts Query
	const {
		loading: postsLoading,
		refetch: refetchPosts,
	} = useQuery(GET_FAVORITE_POSTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setFavoritePosts(data?.getLikedPosts?.list || []);
			setTotals((prev) => ({ ...prev, posts: data?.getLikedPosts?.metaCounter?.[0]?.total || 0 }));
		},
		onError: (error) => {
			console.error('Posts Error:', error);
		},
	});

	// Articles Query
	const {
		loading: articlesLoading,
		refetch: refetchArticles,
	} = useQuery(GET_FAVORITE_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setFavoriteArticles(data?.getLikedArticles?.list || []);
			setTotals((prev) => ({ ...prev, articles: data?.getLikedArticles?.metaCounter?.[0]?.total || 0 }));
		},
		onError: (error) => {
			console.error('Articles Error:', error);
		},
	});

	/** LIFECYCLE */
	useEffect(() => {
		if (user?._id) {
			if (activeTab === 0) refetchProducts({ input: searchParams });
			else if (activeTab === 1) refetchPosts({ input: searchParams });
			else if (activeTab === 2) refetchArticles({ input: searchParams });
		}
	}, [searchParams, activeTab, user?._id, refetchProducts, refetchPosts, refetchArticles]);

	/** HANDLERS **/
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setSearchParams({ page: 1, limit: 6 });
	};

	const paginationHandler = (event: React.ChangeEvent<unknown>, value: number) => {
		setSearchParams({ ...searchParams, page: value });
	};

	const handleRemoveFavorite = async (itemId: string, type: 'product' | 'post' | 'article', e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			if (!user?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please log in!');
				return;
			}

			// Execute the appropriate mutation based on type
			if (type === 'product') {
				await likeTargetProduct({ variables: { input: itemId } });
				await refetchProducts({ input: searchParams });
			} else if (type === 'post') {
				await likeTargetPost({ variables: { input: itemId } });
				await refetchPosts({ input: searchParams });
			} else if (type === 'article') {
				await likeTargetArticle({ variables: { input: itemId } });
				await refetchArticles({ input: searchParams });
			}

			sweetTopSmallSuccessAlert('Removed from favorites!', 800);
		} catch (err: any) {
			console.error('ERROR, handleRemoveFavorite:', err.message);
			sweetMixinErrorAlert(err.message || 'Failed to remove from favorites');
		}
	};

	const handleItemClick = (itemId: string, type: 'product' | 'post' | 'article') => {
		const routes = {
			product: '/product/detail',
			post: '/',
			article: '/article/detail',
		};
		router.push({ pathname: routes[type], query: { id: itemId } });
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price);
	};

	const formatDate = (date: Date | string) => {
		return moment(date).format('MMM D, YYYY');
	};

	const isLoading = productsLoading || postsLoading || articlesLoading;
	const currentTotal = [totals.products, totals.posts, totals.articles][activeTab];

	if (isLoading && searchParams.page === 1) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
						<Heart size={48} style={{ animation: 'pulse 1.5s ease-in-out infinite', color: '#ec4899' }} />
						<Typography variant="body1" color="text.secondary">Loading your favorites...</Typography>
					</Box>
				</Stack>
			</Box>
		);
	}

	if (!user?._id) {
		return (
			<Box className="saved-content-page">
				<Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '50vh', gap: 2 }}>
					<Heart size={64} color="#ec4899" />
					<Typography variant="h5">Please log in</Typography>
					<Typography color="text.secondary">Log in to view your favorites</Typography>
					<button
						onClick={() => router.push('/login')}
						style={{
							padding: '12px 24px',
							background: '#ec4899',
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
				<Typography variant="h6" textAlign="center" mt={4}>Mobile version coming soon...</Typography>
			</Box>
		);
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
						<p className="section-subtitle">Content you loved</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip
						icon={<Heart size={16} />}
						label={`${currentTotal} Item${currentTotal !== 1 ? 's' : ''}`}
						className="total-chip"
					/>
				</Box>
			</Stack>

			{/* Tabs */}
			<Box className="tabs-container">
				<Tabs value={activeTab} onChange={handleTabChange} className="custom-tabs">
					<Tab label={<Box className="tab-label"><Heart size={16} /><span>Products ({totals.products})</span></Box>} />
					<Tab label={<Box className="tab-label"><MessageSquare size={16} /><span>Posts ({totals.posts})</span></Box>} />
					<Tab label={<Box className="tab-label"><FileText size={16} /><span>Articles ({totals.articles})</span></Box>} />
				</Tabs>
			</Box>

			{/* Products Tab */}
			<TabPanel value={activeTab} index={0}>
				<Box className="saved-items-grid">
					{favoriteProducts.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon"><Heart size={64} /></Box>
							<h3>No Favorite Products</h3>
							<p>Start adding products you love</p>
							<button onClick={() => router.push('/product')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Products
							</button>
						</Box>
					) : (
						favoriteProducts.map((product: Product) => {
							const imagePath = product?.productImages?.[0] ? `${REACT_APP_API_URL}/${product.productImages[0]}` : '/img/banner/product.webp';
							return (
								<Box key={product._id} className="saved-item-card" onClick={() => handleItemClick(product._id, 'product')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="favorite-badge">
											<Heart size={16} fill="#ec4899" color="#ec4899" />
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
											<Box className="stat-item"><Eye size={14} /><span>{product.productViews || 0}</span></Box>
											<Box className="stat-item"><Heart size={14} /><span>{product.productLikes || 0}</span></Box>
											<Box className="stat-item date"><Calendar size={14} /><span>{formatDate(product.createdAt)}</span></Box>
										</Stack>
										<Box className="item-actions">
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveFavorite(product._id, 'product', e)} title="Remove">
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
					{favoritePosts.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon"><MessageSquare size={64} /></Box>
							<h3>No Favorite Posts</h3>
							<p>Start adding posts you love</p>
							<button onClick={() => router.push('/')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Community
							</button>
						</Box>
					) : (
						favoritePosts.map((post: Post) => {
							const imagePath = post?.postImages?.[0] ? `${REACT_APP_API_URL}/${post.postImages[0]}` : '/img/banner/post.webp';
							return (
								<Box key={post._id} className="saved-item-card" onClick={() => handleItemClick(post._id, 'post')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={post.postTitle} />
										<Box className="favorite-badge">
											<Heart size={16} fill="#ec4899" color="#ec4899" />
										</Box>
									</Box>
									<Box className="item-content">
										<h3 className="item-title">{post.postTitle}</h3>
										<Box className="item-stats">
											<Stack className="item-stats">
												<Box className="stat-item"><Eye size={14} /><span>{post.postLikes || 0}</span></Box>
												<Box className="stat-item"><MessageSquare size={14} /><span>{post.postComments || 0}</span></Box>
												<Box className="stat-item date"><Calendar size={14} /><span>{formatDate(post.createdAt)}</span></Box>
											</Stack>
										</Box>
										<Box className="item-actions">
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveFavorite(post._id, 'post', e)} title="Remove">
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

			{/* Articles Tab */}
			<TabPanel value={activeTab} index={2}>
				<Box className="saved-items-grid">
					{favoriteArticles.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon"><FileText size={64} /></Box>
							<h3>No Favorite Articles</h3>
							<p>Start adding articles you love</p>
							<button onClick={() => router.push('/article')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Articles
							</button>
						</Box>
					) : (
						favoriteArticles.map((article: Article) => {
							const imagePath = article?.articleImage ? `${REACT_APP_API_URL}/${article.articleImage}` : '/img/banner/article.webp';
							return (
								<Box key={article._id} className="saved-item-card article" onClick={() => handleItemClick(article._id, 'article')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={article.articleTitle} />
										<Box className="favorite-badge">
											<Heart size={16} fill="#ec4899" color="#ec4899" />
										</Box>
										<Chip label={article.articleCategory} className="category-chip" size="small" />
									</Box>
									<Box className="item-content">
										<h3 className="item-title">{article.articleTitle}</h3>
										<p className="article-excerpt">{article.articleContent?.substring(0, 100)}...</p>
										<Stack className="item-stats">
											<Box className="stat-item"><Eye size={14} /><span>{article.articleViews || 0}</span></Box>
											<Box className="stat-item"><Heart size={14} /><span>{article.articleLikes || 0}</span></Box>
											<Box className="stat-item date"><Calendar size={14} /><span>{formatDate(article.createdAt)}</span></Box>
										</Stack>
										<Box className="item-actions">
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveFavorite(article._id, 'article', e)} title="Remove">
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
		</Box>
	);
};

export default withLayoutMain(Favorites);