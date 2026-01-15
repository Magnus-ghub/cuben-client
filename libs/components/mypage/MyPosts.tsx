import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { ArticlesInquiry } from '../../types/article/article.input';
import { GET_POSTS } from '../../apollo/user/query';
import { useQuery, useReactiveVar } from '@apollo/client'; // useReactiveVar qo'shing
import { userVar } from '../../apollo/store'; // userVar import qiling
import { FileText, Calendar, Eye, MessageSquare, Heart, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Post } from '../../types/post/post';

const MyPosts: NextPage = ({ initialInput, ...props }: any) => {
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
				memberId: '', // Bo'sh boshlaydi
			},
		},
	);

	const [userPosts, setUserPosts] = useState<Post[]>([]);

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
		skip: !user?._id, // User yo'q bo'lsa query skip qiladi
		onCompleted: (data: T) => {
			setUserPosts(data?.getPosts?.list || []);
			setTotal(data.getPosts.metaCounter?.[0]?.total || 0);
		},
		onError: (error) => {
			console.error('MyPosts Error:', error);
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
			getPostsRefetch({ input: searchFilter });
		}
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
		console.log('Delete article:', postId);
	};

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	if (!user?._id || getPostsLoading) {
		return (
			<Box className="modern-content-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading your posts...</p>
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
						<h2 className="section-title">My Posts</h2>
						<p className="section-subtitle">Manage your published articles</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<FileText size={16} />} label={`${total} Posts`} className="total-chip" />
				</Box>
			</Stack>

			{/* Articles Grid */}
			<Box className="posts-grid">
				{userPosts?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<FileText size={64} />
						</Box>
						<h3>No Posts Yet</h3>
						<p>Start sharing your thoughts with the community</p>
					</Box>
				) : (
					<>
						{userPosts?.map((post: Post) => {
							const imagePath =
								post?.postImages?.length > 0
									? `${REACT_APP_API_URL}/${post.postImages[0]}`
									: '/img/banner/community.webp';

							return (
								<Box key={post._id} className="post-card" onClick={() => handleArticleClick(post._id)}>
									{/* Article Image */}
									<Box className="post-image">
										<img src={imagePath} alt={post.postTitle} />
									</Box>

									{/* Article Content */}
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
										</Stack>
									</Box>
								</Box>
							);
						})}
					</>
				)}
			</Box>

			{/* Pagination */}
			{userPosts.length > 0 && (
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

MyPosts.defaultProps = {
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

export default MyPosts;
