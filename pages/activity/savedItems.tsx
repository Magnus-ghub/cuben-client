import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Chip, Tabs, Tab, Pagination, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../libs/apollo/store';
import { Bookmark, Eye, Heart, Calendar, MapPin, Trash2, MessageSquare, FileText } from 'lucide-react';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { T } from '../../libs/types/common';
import { Product } from '../../libs/types/product/product';
import { GET_SAVED_PRODUCTS, GET_SAVED_POSTS, GET_SAVED_ARTICLES } from '../../libs/apollo/user/query';
import { SAVE_TARGET_PRODUCT } from '../../libs/apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import moment from 'moment';

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

	// States for each content type
	const [savedProducts, setSavedProducts] = useState<Product[]>([]);
	const [savedPosts, setSavedPosts] = useState<any[]>([]);
	const [savedArticles, setSavedArticles] = useState<any[]>([]);
	const [totals, setTotals] = useState({ products: 0, posts: 0, articles: 0 });

	/** APOLLO REQUESTS **/
	const [saveTargetProduct] = useMutation(SAVE_TARGET_PRODUCT);

	// Products Query
	const {
		loading: productsLoading,
		refetch: refetchProducts,
	} = useQuery(GET_SAVED_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setSavedProducts(data?.getSavedProducts?.list || []);
			setTotals((prev) => ({ ...prev, products: data?.getSavedProducts?.metaCounter?.[0]?.total || 0 }));
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
	} = useQuery(GET_SAVED_POSTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setSavedPosts(data?.getSavedPosts?.list || []);
			setTotals((prev) => ({ ...prev, posts: data?.getSavedPosts?.metaCounter?.[0]?.total || 0 }));
		},
		onError: (error) => {
			console.error('Posts Error:', error);
		},
	});

	// Articles Query
	const {
		loading: articlesLoading,
		refetch: refetchArticles,
	} = useQuery(GET_SAVED_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchParams },
		skip: !user?._id,
		onCompleted: (data: T) => {
			setSavedArticles(data?.getSavedArticles?.list || []);
			setTotals((prev) => ({ ...prev, articles: data?.getSavedArticles?.metaCounter?.[0]?.total || 0 }));
		},
		onError: (error) => {
			console.error('Articles Error:', error);
		},
	});

	/** LIFECYCLE **/
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

	const handleRemoveItem = async (itemId: string, type: 'product' | 'post' | 'article', e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			if (!user?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please log in!');
				return;
			}

			// TODO: Implement mutations for posts and articles
			if (type === 'product') {
				await saveTargetProduct({ variables: { productId: itemId } });
				await refetchProducts({ input: searchParams });
			} else {
				sweetMixinErrorAlert('Feature coming soon for this content type!');
				return;
			}

			sweetTopSmallSuccessAlert('Removed from saved items!', 800);
		} catch (err: any) {
			console.error('ERROR, handleRemoveItem:', err.message);
			sweetMixinErrorAlert(err.message || 'Failed to remove item');
		}
	};

	const handleItemClick = (itemId: string, type: 'product' | 'post' | 'article') => {
		const routes = {
			product: '/product/detail',
			post: '/community/detail',
			article: '/blog/detail',
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
						<Bookmark size={48} style={{ animation: 'pulse 1.5s ease-in-out infinite', color: '#10b981' }} />
						<Typography variant="body1" color="text.secondary">Loading saved items...</Typography>
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
				<Typography variant="h6" textAlign="center" mt={4}>Mobile version coming soon...</Typography>
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
					<Tab label={<Box className="tab-label"><Bookmark size={16} /><span>Products ({totals.products})</span></Box>} />
					<Tab label={<Box className="tab-label"><MessageSquare size={16} /><span>Posts ({totals.posts})</span></Box>} />
					<Tab label={<Box className="tab-label"><FileText size={16} /><span>Articles ({totals.articles})</span></Box>} />
				</Tabs>
			</Box>

			{/* Products Tab */}
			<TabPanel value={activeTab} index={0}>
				<Box className="saved-items-grid">
					{savedProducts.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon"><Bookmark size={64} /></Box>
							<h3>No Saved Products</h3>
							<p>Start bookmarking products</p>
							<button onClick={() => router.push('/product')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Products
							</button>
						</Box>
					) : (
						savedProducts.map((product: Product) => {
							const imagePath = product?.productImages?.[0] ? `${REACT_APP_API_URL}/${product.productImages[0]}` : '/img/banner/product.webp';
							return (
								<Box key={product._id} className="saved-item-card" onClick={() => handleItemClick(product._id, 'product')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={product.productTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#10b981" color="#10b981" />
										</Box>
									</Box>
									<Box className="item-content">
										<h3 className="item-title">{product.productTitle}</h3>
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
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveItem(product._id, 'product', e)} title="Remove">
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
							<Box className="empty-icon"><MessageSquare size={64} /></Box>
							<h3>No Saved Posts</h3>
							<p>Start bookmarking posts</p>
							<button onClick={() => router.push('/community')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Community
							</button>
						</Box>
					) : (
						savedPosts.map((post: any) => {
							const imagePath = post?.postImages?.[0] ? `${REACT_APP_API_URL}/${post.postImages[0]}` : '/img/banner/post.webp';
							return (
								<Box key={post._id} className="saved-item-card" onClick={() => handleItemClick(post._id, 'post')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={post.postTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#10b981" color="#10b981" />
										</Box>
									</Box>
									<Box className="item-content">
										<h3 className="item-title">{post.postTitle}</h3>
										<Stack className="item-stats">
											<Box className="stat-item"><Heart size={14} /><span>{post.postLikes || 0}</span></Box>
											<Box className="stat-item"><MessageSquare size={14} /><span>{post.postComments || 0}</span></Box>
											<Box className="stat-item date"><Calendar size={14} /><span>{formatDate(post.createdAt)}</span></Box>
										</Stack>
										<Box className="item-actions">
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveItem(post._id, 'post', e)} title="Remove">
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
					{savedArticles.length === 0 ? (
						<Box className="empty-state">
							<Box className="empty-icon"><FileText size={64} /></Box>
							<h3>No Saved Articles</h3>
							<p>Start bookmarking articles</p>
							<button onClick={() => router.push('/blog')} 
								style={{ marginTop: '20px', padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
								Browse Articles
							</button>
						</Box>
					) : (
						savedArticles.map((article: any) => {
							const imagePath = article?.articleImage ? `${REACT_APP_API_URL}/${article.articleImage}` : '/img/banner/article.webp';
							return (
								<Box key={article._id} className="saved-item-card article" onClick={() => handleItemClick(article._id, 'article')} style={{ cursor: 'pointer' }}>
									<Box className="item-image">
										<img src={imagePath} alt={article.articleTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#10b981" color="#10b981" />
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
											<IconButton size="small" className="remove-btn" onClick={(e) => handleRemoveItem(article._id, 'article', e)} title="Remove">
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

export default withLayoutMain(SavedItems);