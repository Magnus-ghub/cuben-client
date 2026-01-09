import React, { MouseEvent, useEffect, useState } from 'react';
import { Stack, Box, Button, Avatar } from '@mui/material';
import Link from 'next/link';
import { TrendingUp, Flame, Users, Image as ImageIcon, Video, Smile } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_POST, SAVE_TARGET_POST } from '../../apollo/user/mutation';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { GET_POSTS } from '../../apollo/user/query';
import { Direction, Message } from '../../enums/common.enum';
import { Messages, REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import PostCard from '../community/Postcard';
import { PostsInquiry } from '../../types/post/post.input';
import { Post } from '../../types/post/post';
import { T } from '../../types/common';
import CommentModal from '../common/CommentModal';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MainSection = ({ initialInput }: any) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { query } = router;
	const [posts, setPosts] = useState<Post[]>([]);
	const [searchFilter, setSearchFilter] = useState<PostsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const postCategory = query?.postCategory as string;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [imageError, setImageError] = useState(false);

	if (postCategory) initialInput.search.postCategory = postCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);
	const [saveTargetPost] = useMutation(SAVE_TARGET_POST);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getPostsLoading,
		data: getPostsData,
		error: getPostsError,
		refetch: getPostsRefetch,
	} = useQuery(GET_POSTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPosts(data?.getPosts?.list || []);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
		setCurrentPage(searchFilter?.page ?? 1);
	}, [router, searchFilter]);

	useEffect(() => {
		getPostsRefetch({ input: searchFilter });
	}, [searchFilter]);

	useEffect(() => {
		setCurrentPage(searchFilter?.page ?? 1);
	}, [searchFilter]);

	useEffect(() => {
		if (getPostsError) {
			console.error('Error fetching posts:', getPostsError);
		}
	}, [getPostsError]);

	/** HANDLERS - OPTIMISTIC UPDATES **/
	const likePostHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// OPTIMISTIC UPDATE
			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post._id === id) {
						const isCurrentlyLiked = post.meLiked?.liked || false;
						return {
							...post,
							postLikes: isCurrentlyLiked ? post.postLikes - 1 : post.postLikes + 1,
							meLiked: {
								...post.meLiked,
								liked: !isCurrentlyLiked,
							},
						};
					}
					return post;
				})
			);

			await likeTargetPost({
				variables: { input: id },
			});
		} catch (err: any) {
			console.log('ERROR, likePostHandler:', err.message);

			// Rollback
			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post._id === id) {
						const isCurrentlyLiked = post.meLiked?.liked || false;
						return {
							...post,
							postLikes: isCurrentlyLiked ? post.postLikes - 1 : post.postLikes + 1,
							meLiked: {
								...post.meLiked,
								liked: !isCurrentlyLiked,
							},
						};
					}
					return post;
				})
			);

			sweetMixinErrorAlert(err.message).then();
		}
	};

	const savePostHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// OPTIMISTIC UPDATE
			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post._id === id) {
						const isCurrentlySaved = post.meLiked?.saved || false;
						return {
							...post,
							meLiked: {
								...post.meLiked,
								saved: !isCurrentlySaved,
							},
						};
					}
					return post;
				})
			);

			await saveTargetPost({
				variables: { input: id },
			});
		} catch (err: any) {
			console.log('ERROR, savePostHandler:', err.message);

			// Rollback
			setPosts((prevPosts) =>
				prevPosts.map((post) => {
					if (post._id === id) {
						const isCurrentlySaved = post.meLiked?.saved || false;
						return {
							...post,
							meLiked: {
								...post.meLiked,
								saved: !isCurrentlySaved,
							},
						};
					}
					return post;
				})
			);

			sweetMixinErrorAlert(err.message).then();
		}
	};

	// FIXED: Follow/Unfollow Handler with proper state detection
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Followed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unfollowed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const handleCommentClick = (post: Post) => {
		console.log('Comment clicked for post:', post._id);
		setSelectedPost(post);
		setCommentModalOpen(true);
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

		const baseSearch = { ...searchFilter };

		switch (tab) {
			case 'all':
				setSearchFilter({
					...baseSearch,
					sort: 'createdAt',
					direction: Direction.DESC,
				});
				break;
			case 'following':
				console.log('Following tab - coming soon');
				setSearchFilter({
					...baseSearch,
					sort: 'createdAt',
					direction: Direction.DESC,
				});
				break;
			case 'popular':
				setSearchFilter({
					...baseSearch,
					sort: 'postLikes',
					direction: Direction.DESC,
				});
				break;
		}
	};

	const handleCommentAdded = async () => {
		try {
			const { data } = await getPostsRefetch({ input: searchFilter });
			if (data?.getPosts?.list) {
				setPosts(data.getPosts.list);
			}
		} catch (err) {
			console.error('Error refetching posts:', err);
		}
	};

	if (posts) console.log('posts:', posts);
	if (!posts) return null;

	return (
		<Stack className="main-section">
			<Box className="center-feed">
				{/* Create Post Box */}
				<Box className="create-post-box">
					<Avatar className="user-avatar" src={getUserImageSrc()} alt="user profile" onError={handleImageError} />
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
					<Button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabChange('all')}>
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
					{getPostsLoading && posts.length === 0 ? (
						<Stack className="loading-container">
							<p>Loading posts...</p>
						</Stack>
					) : posts && posts.length > 0 ? (
						posts.map((post: Post) => (
							<PostCard
								key={post._id}
								post={post}
								likePostHandler={likePostHandler}
								savePostHandler={savePostHandler}
								onCommentClick={handleCommentClick}
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
							/>
						))
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
				onCommentAdded={handleCommentAdded}
			/>
		</Stack>
	);
};

MainSection.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MainSection;