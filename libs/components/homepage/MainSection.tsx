import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
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
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { BoardArticle } from '../../types/board-article/board-article';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';
import { Messages, REACT_APP_API_URL } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../apollo/store';
import PostCard from '../community/Postcard';

const MainSection = ({ initialInput }: any) => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { query } = router;

	/** STATES **/
	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [filterSortName, setFilterSortName] = useState('New');
	const [imageError, setImageError] = useState(false);

	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getAgentsrror,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
	}, [searchFilter]);

	/** MOCK DATA - Bu qismni keyinchalik API dan olingan data bilan almashtirish mumkin **/
	const posts = [
		{
			id: 1,
			author: {
				name: 'Emily Johnson',
				username: '@emilyjohnson',
				avatar: '/img/profile/user1.jpg',
				verified: true,
			},
			content:
				'Just finished my final exam! 🎉 Anyone else feeling relieved? Time to enjoy the winter break! What are your plans?',
			timestamp: '2 hours ago',
			likes: 234,
			comments: 45,
			images: ['/img/posts/finalexam.webp'],
			category: 'Campus Life',
		},
		{
			id: 2,
			author: {
				name: 'David Chen',
				username: '@davidchen',
				avatar: '/img/profile/user2.jpg',
				verified: false,
			},
			content:
				'🍕 PIZZA PARTY AT MY DORM! Room 304, Building A. First 20 people get free pizza! Starting at 7 PM tonight. Bring your own drinks! 🎉',
			timestamp: '4 hours ago',
			likes: 567,
			comments: 89,
			images: ['/img/posts/pizzaclub.jpeg'],
			category: 'Food',
		},
		{
			id: 3,
			author: {
				name: 'Mike Wilson',
				username: '@mikewilson',
				avatar: '/img/profile/magnus.png',
				verified: false,
			},
			content:
				'Anyone interested in forming a study group for Advanced Algorithms? Meeting twice a week at the library. 📖',
			timestamp: '5 hours ago',
			likes: 189,
			comments: 34,
			images: [],
			category: 'Study',
		},
		{
			id: 4,
			author: {
				name: 'Sarah Martinez',
				username: '@sarahm',
				avatar: '/img/profile/user3.jpg',
				verified: true,
			},
			content:
				'Looking for study partners for Data Structures course! We can meet at the library every Tuesday and Thursday. DM me if interested 📚',
			timestamp: '6 hours ago',
			likes: 123,
			comments: 34,
			images: [],
			category: 'Study',
		},
	];

	/** HANDLERS **/
	const handleCommentClick = (post) => {
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const handleLikeClick = (postId: number) => {
		console.log('Post liked:', postId);
		// Bu yerda backend ga like so'rovi yuborilishi mumkin
	};

	const handleSaveClick = (postId: number) => {
		console.log('Post saved:', postId);
		// Bu yerda backend ga save so'rovi yuborilishi mumkin
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
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
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
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
						onClick={() => setActiveTab('all')}
					>
						<TrendingUp size={18} />
						For You
					</Button>
					<Button
						className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
						onClick={() => setActiveTab('following')}
					>
						<Users size={18} />
						Following
					</Button>
					<Button
						className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
						onClick={() => setActiveTab('popular')}
					>
						<Flame size={18} />
						Popular
					</Button>
				</Box>

				{/* Posts Feed */}
				<Stack className="posts-feed">
					{posts.map((post) => (
						<PostCard
							key={post.id}
							post={post}
							onCommentClick={handleCommentClick}
							onLikeClick={handleLikeClick}
							onSaveClick={handleSaveClick}
						/>
					))}
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
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default MainSection;