import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { Article } from '../../types/article/article';
import { ArticlesInquiry } from '../../types/article/article.input';
import { GET_POSTS } from '../../apollo/user/query'; 
import { useQuery } from '@apollo/client';
import { FileText, Calendar, Eye, MessageSquare, Heart, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Post } from '../../types/post/post';

const MemberPosts: NextPage = ({ initialInput, ...props }: any) => {
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
	
	const [memberArticles, setMemberArticles] = useState<Post[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getPostsLoading,
		data: getPostsData,
		error: getPostError,
		refetch: getPostsRefetch,
	} = useQuery(GET_POSTS, {
		variables: { input: searchFilter },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberArticles(data?.getPosts?.list || []);
			setTotal(data?.getPosts?.metaCounter?.total || 0); 
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
		getPostsRefetch({ input: searchFilter });
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const handleArticleClick = (postId: string) => {
		router.push(`/post/detail?postId=${postId}`);
	};

	const handleEditArticle = (postId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=writeArticle&articleId=${postId}`);
	};

	const handleDeleteArticle = (postId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// TODO: Implement delete mutation
		console.log('Delete article:', postId);
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
						<h2 className="section-title">Member Posts</h2>
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
						{memberArticles?.map((post: Post) => {
							const imagePath = post?.postImages
								? `${REACT_APP_API_URL}/${post.postImages}`
								: '/img/banner/community.webp';

								const getPostImages = () => {
										if (post?.postImages && Array.isArray(post.postImages)) {
											return post.postImages.map((img) => `${REACT_APP_API_URL}/${img}`);
										}
										return [];
									};
							return (
								<Box
									key={post._id}
									className="article-card"
									onClick={() => handleArticleClick(post._id)}
								>
									{/* Article Image */}
									<Box className="article-image">
										<img src={imagePath} alt={post.postTitle} />
									</Box>

									{/* Article Content */}
									<Box className="article-content">
										<h3 className="article-title">{post.postTitle}</h3>
										<p className="article-description">
											{post.postContent?.substring(0, 120)}
											{post.postContent?.length > 120 && '...'}
										</p>

										{/* Stats Row */}
										<Stack className="article-stats">
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
										<Stack className="article-actions">
											<IconButton
												size="small"
												className="action-btn edit"
												onClick={(e) => handleEditArticle(post._id, e)}
											>
												<Edit size={16} />
											</IconButton>
											<IconButton
												size="small"
												className="action-btn delete"
												onClick={(e) => handleDeleteArticle(post._id, e)}
											>
												<Trash2 size={16} />
											</IconButton>
											<IconButton size="small" className="action-btn more">
												<MoreVertical size={16} />
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

export default MemberPosts;