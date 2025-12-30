import React, { useState } from 'react';
import { Stack, Box, Button, Avatar, Chip } from '@mui/material';
import Link from 'next/link';
import {
	TrendingUp,
	Flame,
	Users,
	Heart,
	MessageCircle,
	Bookmark,
	MoreHorizontal,
	Image as ImageIcon,
	Video,
	Smile,
	Award,
} from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CommentModal from '../common/CommentModal';


const MainSection = () => {
	const device = useDeviceDetect();
	const [activeTab, setActiveTab] = useState('all');
	const [commentModalOpen, setCommentModalOpen] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	
	// Like va Save state
	const [likedPosts, setLikedPosts] = useState({});
	const [savedPosts, setSavedPosts] = useState({});

	// Mock Data
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
	];

	const handleCommentClick = (post) => {
		setSelectedPost(post);
		setCommentModalOpen(true);
	};

	const handleLikeClick = (postId) => {
		setLikedPosts(prev => ({
			...prev,
			[postId]: !prev[postId]
		}));
	};

	const handleSaveClick = (postId) => {
		setSavedPosts(prev => ({
			...prev,
			[postId]: !prev[postId]
		}));
	};

	if (device === 'mobile') {
		return (
			<Stack className="main-section">
				<div>MainSection Mobile</div>
			</Stack>
		);
	}

	return (
		<Stack className="main-section">
			<Box className="center-feed">
				{/* Create Post Box */}
				<Box className="create-post-box">
					<Avatar className="user-avatar" src="/img/profile/defaultUser.svg" />
					<Link href="/create/writePost" style={{ textDecoration: 'none', flex: 1 }}>
						<Box className="create-input">
							<span>What's on your mind?</span>
						</Box>
					</Link>
				</Box>

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
						<Box key={post.id} className="post-card">
							{/* Post Header */}
							<Box className="post-header">
								<Avatar className="post-avatar" src={post.author.avatar} />
								<Box className="post-author-info">
									<Box className="author-name">
										<span>{post.author.name}</span>
										{post.author.verified && <Award size={16} className="verified-badge" />}
									</Box>
									<Box className="post-meta">
										<span>{post.author.username}</span>
										<span>•</span>
										<span>{post.timestamp}</span>
									</Box>
								</Box>
								<Chip label={post.category} size="small" className="post-category" />
								<Button className="post-more-btn">
									<MoreHorizontal size={20} />
								</Button>
							</Box>

							{/* Post Content */}
							<Box className="post-content">
								<p>{post.content}</p>
								{post.images.length > 0 && (
									<Box className="post-images">
										{post.images.map((img, idx) => (
											<img key={idx} src={img} alt="post" />
										))}
									</Box>
								)}
							</Box>

							{/* Post Stats */}
							<Box className="post-stats">
								<span>
									<Heart size={16} /> {post.likes + (likedPosts[post.id] ? 1 : 0)} likes
								</span>
								<span>
									<MessageCircle size={16} /> {post.comments} comments
								</span>
							</Box>

							{/* Post Actions */}
							<Box className="post-actions">
								<Button 
									className={`action-btn ${likedPosts[post.id] ? 'liked' : ''}`}
									onClick={() => handleLikeClick(post.id)}
								>
									<Heart 
										size={20} 
										fill={likedPosts[post.id] ? '#ef4444' : 'none'}
										color={likedPosts[post.id] ? '#ef4444' : 'currentColor'}
									/>
									<span style={{ color: likedPosts[post.id] ? '#ef4444' : 'inherit' }}>
										Like
									</span>
								</Button>
								<Button 
									className="action-btn"
									onClick={() => handleCommentClick(post)}
								>
									<MessageCircle size={20} />
									Comment
								</Button>
								<Button 
									className={`action-btn ${savedPosts[post.id] ? 'saved' : ''}`}
									onClick={() => handleSaveClick(post.id)}
								>
									<Bookmark 
										size={20}
										fill={savedPosts[post.id] ? '#667eea' : 'none'}
										color={savedPosts[post.id] ? '#667eea' : 'currentColor'}
									/>
									<span style={{ color: savedPosts[post.id] ? '#667eea' : 'inherit' }}>
										Save
									</span>
								</Button>
							</Box>
						</Box>
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

export default MainSection;