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
import CommentModal from '../common/CommentModal';  // Import qo'shildi
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_POST, SAVE_TARGET_POST } from '../../apollo/user/mutation';
import { GET_POSTS } from '../../apollo/user/query';
import { Direction } from '../../enums/common.enum';
import { Messages, REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import PostCard from '../community/Postcard';
import { PostsInquiry } from '../../types/post/post.input';
import { Post } from '../../types/post/post';
import { T } from '../../types/common';

const MainSection = ({ initialInput }: any) => {
	const { t } = useTranslation('common');
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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);  // Modal state
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [imageError, setImageError] = useState(false);

	if (postCategory) initialInput.search.postCategory = postCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetPost] = useMutation(LIKE_TARGET_POST);
	const [saveTargetPost] = useMutation(SAVE_TARGET_POST);

	const {
		loading: gtePostsLoading,
		data: getPostsData,
		error: getPostsError,
		refetch: getPostsRefetch,
	} = useQuery(GET_POSTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialInput,
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

	//post data from db
	useEffect(() => {
		if (getPostsData?.getPosts) {
			setPosts(getPostsData.getPosts.list || []);
		}
	}, [getPostsData]);

	useEffect(() => {
		if (getPostsError) {
			console.error('Error fetching posts:', getPostsError);
		}
	}, [getPostsError]);

	/** HANDLERS **/
	const handleCommentClick = (post: Post) => {
		console.log('Opening modal for post:', post._id);  // Debug
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const likePostHandler = async (id: string) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);
			await likeTargetPost({
				variables: { postId: id },
				refetchQueries: [
					{ query: GET_POSTS, variables: { input: initialInput } },
				],
				awaitRefetchQueries: true,
			});
		} catch (err: any) {
			console.error('ERROR in likePostHandler:', err.message);
		}
	};

	const handleSaveClick = async (postId: string) => {
  try {
    if (!postId) return;
    if (!user?._id) throw new Error(Messages.error2);

    const { data } = await saveTargetPost({  // Destructure data
      variables: { postId: postId },
      refetchQueries: [  // List'ni yangilash
        { query: GET_POSTS, variables: { input: initialInput } },
      ],
      awaitRefetchQueries: true,
      update: (cache, { data }) => {  // Cache'ni local yangilash (tezroq UI)
        if (data?.saveTargetPost) {
          const existingPosts = cache.readQuery({ 
            query: GET_POSTS, 
            variables: { input: initialInput } 
          }) as any;

          if (existingPosts?.getPosts?.list) {
            const updatedPosts = existingPosts.getPosts.list.map((p: Post) => 
              p._id === postId 
                ? { 
                    ...p, 
                    meSaved: data.saveTargetPost.meSaved,  // ✅ Yangi response'dan oling
                    postSaves: data.saveTargetPost.postSaves  // Son yangilash
                  }
                : p
            );
            cache.writeQuery({
              query: GET_POSTS,
              variables: { input: initialInput },
              data: { getPosts: { ...existingPosts.getPosts, list: updatedPosts } },
            });
          }
        }
      },
    });
    console.log('Save successful:', data);  // Debug
  } catch (err: any) {
    console.error('ERROR in handleSaveClick:', err.message);
  }
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

	// for sorting for you | popular
	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		
		const baseSearch = { ...searchCommunity };
		
		switch (tab) {
			case 'all':
				setSearchCommunity({ 
					...baseSearch, 
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'following':
				console.log('Following tab - coming soon');
				setSearchCommunity({ 
					...baseSearch, 
					sort: 'createdAt', 
					direction: Direction.DESC 
				});
				break;
			case 'popular':
				setSearchCommunity({ 
					...baseSearch, 
					sort: 'postLikes', 
					direction: Direction.DESC 
				});
				break;
		}
	};

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
					{gtePostsLoading ? (
						<Stack className="loading-container">
							<p>Loading posts...</p>
						</Stack>
					) : posts && posts.length > 0 ? (
						posts.map((post: Post) => (
							<PostCard
								key={post._id}
								post={post}
								likePostHandler={likePostHandler}
								onCommentClick={handleCommentClick}
								onSaveClick={handleSaveClick}
								user={user}
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
				onCommentAdded={() => getPostsRefetch({ input: initialInput })}
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