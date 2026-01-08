import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { Article } from '../../types/article/article';
import { ArticlesInquiry } from '../../types/article/article.input';
import { GET_ARTICLES } from '../../apollo/user/query'; // Added real query
import { useQuery } from '@apollo/client';
import { FileText, Calendar, Eye, MessageSquare, Heart, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction } from '../../enums/common.enum';

const MyArticles: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ArticlesInquiry>(
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
	
	const [memberArticles, setMemberArticles] = useState<Article[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		variables: { input: searchFilter },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberArticles(data?.getArticles?.list || []);
			setTotal(data?.getArticles?.metaCounter?.total || 0); // Single total
		},
		onError: (error) => {
			console.error('MyArticles Error:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) {
			setSearchFilter({ ...searchFilter, search: { memberId: memberId as string } });
		}
	}, [memberId]);

	useEffect(() => {
		getArticlesRefetch({ input: searchFilter });
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleArticleClick = (articleId: string) => {
		router.push(`/article/detail?articleId=${articleId}`);
	};

	const handleEditArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=writeArticle&articleId=${articleId}`);
	};

	const handleDeleteArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// TODO: Implement delete mutation
		console.log('Delete article:', articleId);
	};

	const formatDate = (date: Date | string) => {
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
				{memberArticles?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<FileText size={64} />
						</Box>
						<h3>No Posts Yet</h3>
						<p>Start sharing your thoughts with the community</p>
					</Box>
				) : (
					<>
						{memberArticles?.map((article: Article) => {
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
										<img src={imagePath} alt={article.articleTitle} />
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
			{memberArticles.length > 0 && (
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