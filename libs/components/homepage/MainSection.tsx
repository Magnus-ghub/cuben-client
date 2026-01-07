import React, { MouseEvent, useEffect, useState } from 'react';
import { Stack, Box, Button, Avatar } from '@mui/material';
import Link from 'next/link';
import { TrendingUp, Flame, Users, Image as ImageIcon, Video, Smile } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_POST, SAVE_TARGET_POST } from '../../apollo/user/mutation';
import { GET_POSTS } from '../../apollo/user/query';
import { Direction, Message } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import PostCard from '../community/Postcard';
import { PostsInquiry } from '../../types/post/post.input';
import { Post } from '../../types/post/post';
import { T } from '../../types/common';
import CommentModal from '../common/CommentModal';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MainSection = ({ initialInput }: any) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { query } = router;

	/** STATES **/
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

	console.log('Modal state:', { commentModalOpen, selectedPost: selectedPost?._id });

	if (postCategory) initialInput.search.postCategory = postCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);
	const [saveTargetPost] = useMutation(SAVE_TARGET_POST);

	const {
		loading: getPostsLoading,
		data: getPostsData,
		error: getPostsError,
		refetch: getPostsRefetch,
	} = useQuery(GET_POSTS, {
		fetchPolicy: 'network-only',
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

	/** HANDLERS **/
	const likePostHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetPost({
				variables: { input: id },
			});

			await getPostsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePostHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const savePostHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await saveTargetPost({
				variables: { input: id },
			});

			await getPostsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Saved successfully!', 800);
		} catch (err: any) {
			console.log('ERROR, savePostHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
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
					{getPostsLoading ? (
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
				onCommentAdded={() => getPostsRefetch({ input: searchFilter })}
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
