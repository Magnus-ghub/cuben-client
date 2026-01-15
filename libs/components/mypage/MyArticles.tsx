import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { ArticlesInquiry } from '../../types/article/article.input';
import { GET_ARTICLES } from '../../apollo/user/query';
import { useQuery, useReactiveVar } from '@apollo/client'; 
import { userVar } from '../../apollo/store'; 
import { FileText, Calendar, Eye, MessageSquare, Heart, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Article } from '../../types/article/article';
import { ArticleCategory } from '../../enums/article.enum';

const MyArtices: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);

	const [searchFilter, setSearchFilter] = useState<ArticlesInquiry>(
		initialInput || {
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				memberId: '',
			},
		},
	);

	const [userArticles, setUserArticles] = useState<Article[]>([]);

	/** CATEGORY STYLES **/
	const getCategoryStyles = (category: string) => {
		const styles: any = {
			[ArticleCategory.CAREER]: {
				bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
				color: '#f59e0b',
				icon: '💼',
				label: 'Career',
			},
			[ArticleCategory.EVENTS]: {
				bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
				color: '#ec4899',
				icon: '🎉',
				label: 'Event',
			},
			[ArticleCategory.ANNOUNCEMENTS]: {
				bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
				color: '#3b82f6',
				icon: '📰',
				label: 'News',
			},
			[ArticleCategory.KNOWLEDGE]: {
				bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
				color: '#8b5cf6',
				icon: '📚',
				label: 'Resource',
			},
		};
		return styles[category] || styles[ArticleCategory.CAREER];
	};

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
		skip: !user?._id, 
		onCompleted: (data: T) => {
			setUserArticles(data?.getArticles?.list || []);
			setTotal(data.getArticles.metaCounter?.[0]?.total || 0);
		},
		onError: (error) => {
			console.error('MyArticles Error:', error);
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
			getArticlesRefetch({ input: searchFilter });
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleArticleClick = (article: Article) => {
		router.push({
			pathname: '/article/detail',
			query: {
				id: article._id,
				articleCategory: article.articleCategory,
			},
		});
	};

	const handleEditArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=writeArticle&articleId=${articleId}`);
	};

	const handleDeleteArticle = (articleId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		console.log('Delete article:', articleId);
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	if (!user?._id || getArticlesLoading) {
		return (
			<Box className="modern-content-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading your articles...</p>
				</Stack>
			</Box>
		);
	}

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
						<h2 className="section-title">My Articles</h2>
						<p className="section-subtitle">Manage your published articles</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<FileText size={16} />} label={`${total} Articles`} className="total-chip" />
				</Box>
			</Stack>

			{/* Articles Grid */}
			<Box className="posts-grid">
				{userArticles?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<FileText size={64} />
						</Box>
						<h3>No Articles Yet</h3>
						<p>Start sharing your thoughts with the community</p>
					</Box>
				) : (
					<>
						{userArticles?.map((article: Article) => {
							const categoryStyle = getCategoryStyles(article?.articleCategory);
							const imagePath = article?.articleImage
								? `${REACT_APP_API_URL}/${article.articleImage}`
								: null;

							return (
								<Box key={article._id} className="post-card" onClick={() => handleArticleClick(article)}>
									{/* Article Image or Gradient Placeholder */}
									<Box className="post-image">
										{imagePath ? (
											<img src={imagePath} alt={article.articleTitle} />
										) : (
											<Box
												sx={{
													width: '100%',
													height: '100%',
													background: categoryStyle.bg,
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													justifyContent: 'center',
													gap: '12px',
												}}
											>
												<Box
													sx={{
														fontSize: '48px',
														lineHeight: 1,
													}}
												>
													{categoryStyle.icon}
												</Box>
												<Box
													sx={{
														fontSize: '18px',
														fontWeight: 700,
														color: '#ffffff',
														textTransform: 'uppercase',
														letterSpacing: '1px',
													}}
												>
													{categoryStyle.label}
												</Box>
											</Box>
										)}
										
										{/* Category Badge Overlay */}
										{imagePath && (
											<Box
												sx={{
													position: 'absolute',
													top: '12px',
													left: '12px',
													background: categoryStyle.bg,
													color: '#ffffff',
													padding: '6px 12px',
													borderRadius: '8px',
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
													fontSize: '12px',
													fontWeight: 700,
													boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
												}}
											>
												<span style={{ fontSize: '14px' }}>{categoryStyle.icon}</span>
												<span>{categoryStyle.label}</span>
											</Box>
										)}
									</Box>

									{/* Article Content */}
									<Box className="post-content">
										<h3 className="post-title">{article.articleTitle}</h3>
										<p className="post-description">
											{article.articleContent?.substring(0, 120)}
											{article.articleContent?.length > 120 && '...'}
										</p>

										{/* Stats Row */}
										<Stack className="post-stats">
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
										<Stack className="post-actions">
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
										</Stack>
									</Box>
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{/* Pagination */}
			{userArticles.length > 0 && (
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

MyArtices.defaultProps = {
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

export default MyArtices;