import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Box, Chip, IconButton, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { T } from '../../types/common';
import { PostsInquiry } from '../../types/post/post.input';
import { GET_POSTS } from '../../apollo/user/query';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { FileText, Calendar, MessageSquare, Heart, Edit, Trash2 } from 'lucide-react';
import { REACT_APP_API_URL } from '../../config';
import { Direction, Message } from '../../enums/common.enum';
import { Post } from '../../types/post/post';
import CommentModal from '../common/CommentModal';
import { REMOVE_POST } from '../../apollo/user/mutation';
import { sweetConfirmAlert, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MyPosts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [commentModalOpen, setCommentModalOpen] = useState(false);

	const [searchFilter, setSearchFilter] = useState<PostsInquiry>(
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

	const [userPosts, setUserPosts] = useState<Post[]>([]);

	/** APOLLO REQUESTS **/
	const [removePost] = useMutation(REMOVE_POST);

	const {
		loading: getPostsLoading,
		data: getPostsData,
		error: getPostError,
		refetch: getPostsRefetch,
	} = useQuery(GET_POSTS, {
		variables: { input: searchFilter },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		skip: !user?._id,
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

	const handlePostClick = (post: Post) => {
		console.log('Comment clicked for post:', post._id);
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const handleCommentAdded = async () => {
		try {
			const { data } = await getPostsRefetch({ input: searchFilter });
			if (data?.getPosts?.list) {
				setUserPosts(data.getPosts.list);
			}
		} catch (err) {
			console.error('Error refetching posts:', err);
		}
	};

	const handleEditPost = (postId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		router.push(`/mypage?category=updateItem&postId=${postId}`);
	};

	const handleDeletePost = async (postId: string, e: React.MouseEvent) => {
		e.stopPropagation();

		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			const confirmed = await sweetConfirmAlert(
				'Are you sure you want to delete this post? This action cannot be undone.',
			);
			if (!confirmed) return;

			await removePost({
				variables: { input: postId },
			});

			// Refetch products after deletion
			await getPostsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('Post deleted successfully!', 800);
		} catch (err: any) {
			console.error('Delete Post Error:', err.message);
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
		return <div>MY POSTS MOBILE</div>;
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
						<p className="section-subtitle">Manage your published posts</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<FileText size={16} />} label={`${total} Posts`} className="total-chip" />
				</Box>
			</Stack>

			{/* Posts Grid */}
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
									: '/img/default-product.png';

							return (
								<Box key={post._id} className="post-card" onClick={() => handlePostClick(post)}>
									{/* Post Image */}
									<Box className="post-image">
										<img src={imagePath} alt={post.postTitle} />
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
												<MessageSquare size={16} style={{ cursor: 'pointer' }} />
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
												onClick={(e) => handleEditPost(post._id, e)}
											>
												<Edit size={16} />
											</IconButton>
											<IconButton
												size="small"
												className="action-btn delete"
												onClick={(e) => handleDeletePost(post._id, e)}
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

			{/* Comment Modal */}
			<CommentModal
				open={commentModalOpen}
				onClose={() => setCommentModalOpen(false)}
				post={selectedPost}
				onCommentAdded={handleCommentAdded}
			/>
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
