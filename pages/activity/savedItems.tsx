import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Chip, Pagination, IconButton, Tabs, Tab } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { Bookmark, Package, FileText, Eye, Heart, Calendar, MapPin, Trash2, Filter } from 'lucide-react';
import { REACT_APP_API_URL } from '../../libs/config';
import { Product } from '../../libs/types/product/product';
import { BoardArticle } from '../../libs/types/board-article/board-article';


export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SavedItems: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(0);
	const [searchSaved, setSearchSaved] = useState({ page: 1, limit: 8 });

	// Mock Data - Saved Products
	const mockSavedProducts: Product[] = [
		{
			_id: '1',
			productName: 'Gaming PC RTX 4080 Setup',
			productPrice: 2500000,
			productImages: ['/img/products/pc1.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 1890,
			productLikes: 345,
			createdAt: '2024-12-25T10:30:00Z',
		},
		{
			_id: '2',
			productName: 'Vintage Camera Collection',
			productPrice: 450000,
			productImages: ['/img/products/camera1.jpg'],
			productLocation: 'Hongdae, Seoul',
			productStatus: 'ACTIVE',
			productViews: 678,
			productLikes: 123,
			createdAt: '2024-12-23T14:20:00Z',
		},
		{
			_id: '3',
			productName: 'Designer Office Chair',
			productPrice: 380000,
			productImages: ['/img/products/chair2.jpg'],
			productLocation: 'Gangnam, Seoul',
			productStatus: 'ACTIVE',
			productViews: 456,
			productLikes: 89,
			createdAt: '2024-12-20T09:15:00Z',
		},
	];

	// Mock Data - Saved Articles
	const mockSavedArticles: BoardArticle[] = [
		{
			_id: '1',
			articleCategory: 'TECHNOLOGY',
			articleTitle: '10 Best Productivity Apps for 2024',
			articleContent: 'Discover the most powerful productivity tools that will transform your workflow...',
			articleImage: '/img/community/tech3.jpg',
			articleViews: 2340,
			articleLikes: 456,
			articleComments: 78,
			createdAt: '2024-12-26T10:30:00Z',
		},
		{
			_id: '2',
			articleCategory: 'LIFESTYLE',
			articleTitle: 'Minimalist Home Design Ideas',
			articleContent: 'Transform your living space with these simple yet elegant design principles...',
			articleImage: '/img/community/lifestyle3.jpg',
			articleViews: 1567,
			articleLikes: 289,
			articleComments: 45,
			createdAt: '2024-12-24T14:20:00Z',
		},
	];

	const [savedProducts, setSavedProducts] = useState<Product[]>(mockSavedProducts);
	const [savedArticles, setSavedArticles] = useState<BoardArticle[]>(mockSavedArticles);
	const [totalProducts] = useState<number>(mockSavedProducts.length);
	const [totalArticles] = useState<number>(mockSavedArticles.length);

	useEffect(() => {
		// Simulate pagination
		const startIndex = (searchSaved.page - 1) * searchSaved.limit;
		const endIndex = startIndex + searchSaved.limit;
		
		if (activeTab === 0) {
			setSavedProducts(mockSavedProducts.slice(startIndex, endIndex));
		} else {
			setSavedArticles(mockSavedArticles.slice(startIndex, endIndex));
		}
	}, [searchSaved, activeTab]);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setSearchSaved({ page: 1, limit: 8 });
	};

	const paginationHandler = (e: any, value: number) => {
		setSearchSaved({ ...searchSaved, page: value });
	};

	const handleRemoveItem = (itemId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		console.log('Remove saved item:', itemId);
	};

	const handleProductClick = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const handleArticleClick = (articleId: string) => {
		router.push(`/community/detail?articleId=${articleId}`);
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
		return <div>SAVED ITEMS MOBILE</div>;
	}

	const currentTotal = activeTab === 0 ? totalProducts : totalArticles;
	const currentItems = activeTab === 0 ? savedProducts : savedArticles;

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
						label={`${currentTotal} Items`} 
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
								<Package size={18} />
								<span>Products ({totalProducts})</span>
							</Box>
						} 
					/>
					<Tab 
						label={
							<Box className="tab-label">
								<FileText size={18} />
								<span>Articles ({totalArticles})</span>
							</Box>
						} 
					/>
				</Tabs>
			</Box>

			{/* Content Grid */}
			<Box className="saved-items-grid">
				{currentItems?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Bookmark size={64} />
						</Box>
						<h3>No Saved Items</h3>
						<p>Save products or articles to view them here</p>
					</Box>
				) : activeTab === 0 ? (
					// Products Grid
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
								>
									<Box className="item-image">
										<img src={imagePath} alt={product.productName} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#667eea" color="#667eea" />
										</Box>
									</Box>

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
				) : (
					// Articles Grid
					<>
						{savedArticles.map((article: BoardArticle) => {
							const imagePath = article?.articleImage
								? `${REACT_APP_API_URL}/${article.articleImage}`
								: '/img/banner/community.webp';

							return (
								<Box
									key={article._id}
									className="saved-item-card article"
									onClick={() => handleArticleClick(article._id)}
								>
									<Box className="item-image">
										<img src={imagePath} alt={article.articleTitle} />
										<Box className="saved-badge">
											<Bookmark size={16} fill="#667eea" color="#667eea" />
										</Box>
										<Chip label={article.articleCategory} className="category-chip" size="small" />
									</Box>

									<Box className="item-content">
										<h3 className="item-title">{article.articleTitle}</h3>
										
										<p className="article-excerpt">
											{article.articleContent?.substring(0, 80)}...
										</p>

										<Stack className="item-stats">
											<Box className="stat-item">
												<Eye size={14} />
												<span>{article.articleViews}</span>
											</Box>
											<Box className="stat-item">
												<Heart size={14} />
												<span>{article.articleLikes}</span>
											</Box>
											<Box className="stat-item date">
												<Calendar size={14} />
												<span>{formatDate(article.createdAt)}</span>
											</Box>
										</Stack>

										<Box className="item-actions">
											<IconButton
												size="small"
												className="remove-btn"
												onClick={(e) => handleRemoveItem(article._id, e)}
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
			{currentItems.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(currentTotal / searchSaved.limit)}
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