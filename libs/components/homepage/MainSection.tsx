import React, { MouseEvent, useEffect, useState } from 'react';
import { Stack, Box, Button, Avatar, Pagination } from '@mui/material';
import Link from 'next/link';
import {
	TrendingUp,
	Flame,
	Users,
	Image as ImageIcon,
	Video,
	Smile,
} from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CommentModal from '../common/CommentModal';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_POST } from '../../apollo/user/mutation';
import { GET_POSTS } from '../../apollo/user/query';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';
import { Messages, REACT_APP_API_URL } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../apollo/store';
import PostCard from '../community/Postcard';
import { PostsInquiry } from '../../types/post/post.input';
import { Post } from '../../types/post/post';

const MainSection = ({ initialInput }: any) => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { query } = router;

	/** STATES **/
	const [searchCommunity, setSearchCommunity] = useState<PostsInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});
	const [posts, setPosts] = useState<Post[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [imageError, setImageError] = useState(false);

	/** APOLLO REQUESTS **/
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);

	const {
		loading: postsLoading,
		data: postsData,
		error: getPostsError,
		refetch: postsRefetch,
	} = useQuery(GET_POSTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Posts data received:', data);
			if (data?.getPosts) {
				setPosts(data.getPosts.list || []);
				setTotalCount(data.getPosts.metaCounter?.[0]?.total || 0);
			}
		},
		onError: (error) => {
			console.error('Error fetching posts:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		console.log('Search community changed:', searchCommunity);
	}, [searchCommunity]);

	useEffect(() => {
		if (getPostsError) {
			console.error('Get posts error:', getPostsError);
			sweetMixinErrorAlert('Failed to load posts').then();
		}
	}, [getPostsError]);

	/** HANDLERS **/
	const handleCommentClick = (post: Post) => {
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const handleLikeClick = async (currentUser: any, postId: string) => {
		try {
			if (!postId) return;
			if (!currentUser?._id) {
				sweetMixinErrorAlert(Messages.error2 || 'Please login first').then();
				return;
			}

			await likeTargetPost({
				variables: {
					postId: postId,
				},
			});

			await postsRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.error('ERROR, handleLikeClick:', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleSaveClick = (postId: string) => {
		console.log('Post saved:', postId);
		// TODO: Backend save mutation qo'shish kerak
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const getUserImageSrc = () => {
		if (imageError) {
			return '/img/profile/defaultUser.svg';
		}
		if (user?.memberImage) {
			return `${REACT_APP_API_URL}/${user.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		
		switch (tab) {
			case 'all':
				setSearchCommunity({ 
					...searchCommunity, 
					page: 1,
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'following':
				// TODO: Following logic qo'shish kerak
				console.log('Following tab clicked');
				setSearchCommunity({ 
					...searchCommunity, 
					page: 1,
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'popular':
				setSearchCommunity({ 
					...searchCommunity, 
					page: 1,
					sort: 'postLikes', 
					direction: Direction.DESC 
				});
				break;
		}
	};

	/** MOBILE VIEW **/
	if (device === 'mobile') {
		return (
			<Stack className="main-section">
				<div>MainSection Mobile</div>
			</Stack>
		);
	}

	/** DESKTOP VIEW **/
	return (
		<Stack className="main-section">
			<Box className="center-feed">
				{/* Create Post Box */}
				<Box className="create-post-box">
					<Avatar 
						className="user-avatar" 
						src={getUserImageSrc()} 
						alt="user profile" 
						onError={handleImageError} 
					/>
					<Link href="/create/writePost" style={{ textDecoration: 'none', flex: 1 }}>
						<Box className="create-input">
							<span>What's on your mind?</span>
						</Box>
					</Link>
				</Box>

				{/* Create Post Actions */}
				<Stack className="create-post-actions">
					<Button startIcon={<ImageIcon size={18} />} className="post-action-btn">
						Photo
					</Button>
					<Button startIcon={<Video size={18} />} className="post-action-btn">
						Video
					</Button>
					<Button startIcon={<Smile size={18} />} className="post-action-btn">
						Feeling
					</Button>
				</Stack>

				{/* Feed Tabs */}
				<Box className="feed-tabs">
					<Button
						className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
						onClick={() => handleTabChange('all')}
					>
						<TrendingUp size={18} />
						For You
					</Button>
					<Button
						className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
						onClick={() => handleTabChange('following')}
					>
						<Users size={18} />
						Following
					</Button>
					<Button
						className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
						onClick={() => handleTabChange('popular')}
					>
						<Flame size={18} />
						Popular
					</Button>
				</Box>

				{/* Posts Feed */}
				<Stack className="posts-feed">
					{postsLoading ? (
						<Stack className="loading-container">
							<p>Loading posts...</p>
						</Stack>
					) : posts && posts.length > 0 ? (
						<>
							{posts.map((post: Post) => (
								<PostCard
									key={post._id}
									post={post}
									onCommentClick={handleCommentClick}
									onLikeClick={handleLikeClick}
									onSaveClick={handleSaveClick}
									currentUser={user}
								/>
							))}
							
							{/* Pagination */}
							{totalCount > searchCommunity.limit && (
								<Stack className="pagination-box">
									<Pagination
										page={searchCommunity.page}
										count={Math.ceil(totalCount / searchCommunity.limit)}
										onChange={paginationHandler}
										color="primary"
										shape="circular"
									/>
								</Stack>
							)}
						</>
					) : (
						<Stack className="no-data">
							<img src="/img/icons/icoAlert.svg" alt="No posts" />
							<p>No posts found!</p>
						</Stack>
					)}
				</Stack>
			</Box>

			{/* Comment Modal */}
			<CommentModal
				open={commentModalOpen}
				onClose={() => setCommentModalOpen(false)}
				post={selectedPost}
			/>
		</Stack>
	);
};

export default MainSection;