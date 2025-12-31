import React, { MouseEvent, useEffect, useState } from 'react';
import { Stack, Box, Button, Avatar } from '@mui/material';
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
import { LIKE_TARGET_POST, SAVE_TARGET_POST } from '../../apollo/user/mutation';
import { GET_POSTS } from '../../apollo/user/query';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';
import { Messages, REACT_APP_API_URL } from '../../config';
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

	// Initialize with initialInput immediately
	const [searchCommunity, setSearchCommunity] = useState<PostsInquiry>(initialInput);
	
	/** STATES **/
	const [searchFilter, setSearchFilter] = useState<PostsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const postCategory = query?.postCategory as string;
	const [posts, setPosts] = useState<Post[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [filterSortName, setFilterSortName] = useState('New');
	const [imageError, setImageError] = useState(false);

	if (postCategory) initialInput.search.postCategory = postCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);
	const [saveTargetPost] = useMutation(SAVE_TARGET_POST);

	const {
		loading: postsLoading,
		data: postsData,
		error: postsError,
		refetch: postsRefetch,
	} = useQuery(GET_POSTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
	}, [router]);

	useEffect(() => {
		setCurrentPage(searchFilter?.page ?? 1);
	}, [searchFilter]);

	useEffect(() => {
		if (postsData?.getPosts) {
			setPosts(postsData.getPosts.list || []);
			setTotalCount(postsData.getPosts.metaCounter?.[0]?.total || 0);
		}
	}, [postsData]);

	useEffect(() => {
		if (postsError) {
			console.error('Error fetching posts:', postsError);
		}
	}, [postsError]);

	/** HANDLERS **/
	const handleCommentClick = (post: Post) => {
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const handleLikeClick = async (currentUser: any, postId: string) => {
		try {
			if (!postId) return;
			if (!currentUser?._id) throw new Error(Messages.error2);

			await likeTargetPost({
				variables: {
					postId: postId,
				},
			});

			await postsRefetch({ input: searchCommunity });
		} catch (err: any) {
			console.log('ERROR, handleLikeClick:', err.message);
		}
	};

	const handleSaveClick = async (postId: string) => {
		try {
			if (!postId) return;
			if (!user?._id) throw new Error(Messages.error2);

			await saveTargetPost({
				variables: {
					postId: postId,
				},
			});

			await postsRefetch({ input: searchCommunity });
		} catch (err: any) {
			console.log('ERROR, handleSaveClick:', err.message);
		}
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setSearchCommunity({ ...searchCommunity, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortName('New');
				break;
			case 'popular':
				setSearchFilter({ ...searchFilter, sort: 'postLikes', direction: Direction.DESC });
				setSearchCommunity({ ...searchCommunity, sort: 'postLikes', direction: Direction.DESC });
				setFilterSortName('Popular');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'postViews', direction: Direction.DESC });
				setSearchCommunity({ ...searchCommunity, sort: 'postViews', direction: Direction.DESC });
				setFilterSortName('Most Viewed');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
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
		
		const baseSearch = { ...searchCommunity };
		
		switch (tab) {
			case 'all':
				// For You - yangi postlar (createdAt)
				setSearchCommunity({ 
					...baseSearch, 
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'following':
				// Following - Hozircha default (keyinchalik memberId filter qo'shiladi)
				console.log('Following tab - coming soon');
				setSearchCommunity({ 
					...baseSearch, 
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'popular':
				// Popular - Ko'p like olgan postlar
				setSearchCommunity({ 
					...baseSearch, 
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
						posts.map((post: Post) => (
							<PostCard
								key={post._id}
								post={post}
								onCommentClick={handleCommentClick}
								onLikeClick={handleLikeClick}
								onSaveClick={handleSaveClick}
								currentUser={user}
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