import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { FileText, Calendar, Eye, MessageSquare, Heart, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';

const MyArticles: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>(
		initialInput || {
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: 'DESC',
			search: {},
		}
	);
	
	// Mock Data - Replace with real API data later
	const mockArticles: BoardArticle[] = [
		{
			_id: '1',
			articleCategory: 'COMMUNITY',
			articleTitle: 'Getting Started with React and TypeScript',
			articleContent: 'Learn how to build modern web applications using React with TypeScript. This comprehensive guide covers everything from basic setup to advanced patterns and best practices for scalable applications.',
			articleImage: '/img/community/communityImg.png',
			articleViews: 1250,
			articleLikes: 89,
			articleComments: 23,
			createdAt: '2024-12-20T10:30:00Z',
		},
		{
			_id: '2',
			articleCategory: 'LIFESTYLE',
			articleTitle: 'Top 10 Productivity Tips for Remote Workers',
			articleContent: 'Working from home can be challenging. Here are ten proven strategies to boost your productivity, maintain work-life balance, and stay motivated while working remotely.',
			articleImage: '/img/community/communityImg.png',
			articleViews: 890,
			articleLikes: 67,
			articleComments: 15,
			createdAt: '2024-12-18T14:20:00Z',
		},
		{
			_id: '3',
			articleCategory: 'TRAVEL',
			articleTitle: 'Hidden Gems in South Korea You Must Visit',
			articleContent: 'Discover the most beautiful and lesser-known destinations in South Korea. From stunning mountains to serene beaches, explore places that most tourists miss.',
			articleImage: '/img/community/communityImg.png',
			articleViews: 2100,
			articleLikes: 156,
			articleComments: 42,
			createdAt: '2024-12-15T09:15:00Z',
		},
		{
			_id: '4',
			articleCategory: 'TECHNOLOGY',
			articleTitle: 'The Future of AI in Web Development',
			articleContent: 'Artificial Intelligence is transforming how we build websites. Explore the latest AI tools and techniques that are revolutionizing web development in 2024.',
			articleImage: "/img/product/macbookpro.jpeg",
			articleViews: 3400,
			articleLikes: 234,
			articleComments: 67,
			createdAt: '2024-12-12T16:45:00Z',
		},
		{
			_id: '5',
			articleCategory: 'FOOD',
			articleTitle: 'Authentic Korean Street Food Guide',
			articleContent: 'From tteokbokki to hotteok, explore the delicious world of Korean street food. A complete guide to the best street food spots in Seoul and beyond.',
			articleImage: "/img/product/macbookpro.jpeg",
			articleViews: 1680,
			articleLikes: 123,
			articleComments: 34,
			createdAt: '2024-12-10T11:30:00Z',
		},
		{
			_id: '6',
			articleCategory: 'LIFESTYLE',
			articleTitle: 'Minimalist Living: A Beginners Guide',
			articleContent: 'Simplify your life with minimalism. Learn practical steps to declutter your space, reduce stress, and focus on what truly matters.',
			articleImage: "/img/product/macbookpro.jpeg",
			articleViews: 945,
			articleLikes: 71,
			articleComments: 19,
			createdAt: '2024-12-08T13:20:00Z',
		},
	];
	
	const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>(mockArticles);

	/** APOLLO REQUESTS **/
	// TODO: Add GraphQL query
	// const { data, loading, refetch } = useQuery(GET_MEMBER_ARTICLES, {
	//   variables: { input: searchFilter },
	// });

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) {
			setSearchFilter({ ...searchFilter, search: { memberId: memberId as string } });
		}
	}, [memberId]);

	useEffect(() => {
		// TODO: Fetch articles data
		// if (data?.getMemberArticles) {
		//   setMemberBoArticles(data.getMemberArticles.list);
		//   setTotal(data.getMemberArticles.metaCounter[0]?.total || 0);
		// }
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleArticleClick = (articleId: string) => {
		router.push(`/community/detail?articleId=${articleId}`);
	};

	const handleEditArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=writeArticle&articleId=${articleId}`);
	};

	const handleDeleteArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// TODO: Implement delete functionality
		console.log('Delete article:', articleId);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	if (device === 'mobile') {
		return <div>MY ARTICLES MOBILE</div>;
	}

	return (
		<Box className="modern-content-container">
			{/* Header Section */}
			<Stack className="content-header">
				<Box className="header-left">
					<Box className="title-icon">
						<FileText size={24} />
					</Box>
					<Box>
						<h2 className="section-title">My Posts</h2>
						<p className="section-subtitle">Manage your published articles</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<FileText size={16} />} label={`${total} Posts`} className="total-chip" />
				</Box>
			</Stack>

			{/* Articles Grid */}
			<Box className="articles-grid">
				{memberBoArticles?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<FileText size={64} />
						</Box>
						<h3>No Posts Yet</h3>
						<p>Start sharing your thoughts with the community</p>
					</Box>
				) : (
					<>
						{memberBoArticles?.map((article: BoardArticle) => {
							const imagePath = article?.articleImage
								? `${REACT_APP_API_URL}/${article.articleImage}`
								: '/img/banner/community.webp';

							return (
								<Box
									key={article._id}
									className="article-card"
									onClick={() => handleArticleClick(article._id)}
								>
									{/* Article Image */}
									<Box className="article-image">
										<img src="/img/product/macbookpro.jpeg" alt={article.articleTitle} />
										<Box className="image-overlay">
											<Chip label={article.articleCategory} className="category-chip" size="small" />
										</Box>
									</Box>

									{/* Article Content */}
									<Box className="article-content">
										<h3 className="article-title">{article.articleTitle}</h3>
										<p className="article-description">
											{article.articleContent?.substring(0, 120)}
											{article.articleContent?.length > 120 && '...'}
										</p>

										{/* Stats Row */}
										<Stack className="article-stats">
											<Box className="stat-item">
												<Eye size={16} />
												<span>{article.articleViews || 0}</span>
											</Box>
											<Box className="stat-item">
												<Heart size={16} />
												<span>{article.articleLikes || 0}</span>
											</Box>
											<Box className="stat-item">
												<MessageSquare size={16} />
												<span>{article.articleComments || 0}</span>
											</Box>
											<Box className="stat-item date">
												<Calendar size={16} />
												<span>{formatDate(article.createdAt)}</span>
											</Box>
										</Stack>

										{/* Action Buttons */}
										<Stack className="article-actions">
											<IconButton
												size="small"
												className="action-btn edit"
												onClick={(e) => handleEditArticle(article._id, e)}
											>
												<Edit size={16} />
											</IconButton>
											<IconButton
												size="small"
												className="action-btn delete"
												onClick={(e) => handleDeleteArticle(article._id, e)}
											>
												<Trash2 size={16} />
											</IconButton>
											<IconButton size="small" className="action-btn more">
												<MoreVertical size={16} />
											</IconButton>
										</Stack>
									</Box>

									{/* Performance Indicator */}
									{article.articleViews > 100 && (
										<Box className="trending-badge">
											<TrendingUp size={14} />
											<span>Trending</span>
										</Box>
									)}
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{/* Pagination */}
			{memberBoArticles.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						count={Math.ceil(total / searchFilter.limit) || 1}
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

export default MyArticles;