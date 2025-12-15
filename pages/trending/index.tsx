import React, { useState, useEffect } from 'react';
import { Stack, Box, Button, Avatar, Chip, CircularProgress } from '@mui/material';
import Link from 'next/link';
import {
	TrendingUp,
	Flame,
	Users,
	Heart,
	MessageCircle,
	Share2,
	Bookmark,
	MoreHorizontal,
	Image as ImageIcon,
	Video,
	Smile,
	Award,
	Briefcase,
	ShoppingBag,
	ArrowRight,
	Zap,
} from 'lucide-react';
import withLayoutMain from '../../libs/components/layout/LayoutHome';

const Homepage = () => {
	const [activeTab, setActiveTab] = useState('all');
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	// Initial posts data
	const initialPosts = [
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
			shares: 12,
			images: ['/img/posts/exam.jpg'],
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
			shares: 34,
			images: ['/img/posts/pizza.jpg'],
			category: 'Food',
		},
		{
			id: 3,
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
			shares: 8,
			images: [],
			category: 'Study',
		},
		{
			id: 4,
			author: {
				name: 'Michael Park',
				username: '@mikepark',
				avatar: '/img/profile/user4.jpg',
				verified: false,
			},
			content:
				'Found a lost wallet near the library! It has a BUFS student ID. If its yours, please DM me with details to claim it. 🆔',
			timestamp: '8 hours ago',
			likes: 89,
			comments: 12,
			shares: 45,
			images: [],
			category: 'Campus Life',
		},
		{
			id: 5,
			author: {
				name: 'Jessica Lee',
				username: '@jessicalee',
				avatar: '/img/profile/user5.jpg',
				verified: true,
			},
			content:
				'Selling my MacBook Pro 2022 M2 chip. Perfect condition, barely used. Comes with original box and charger. Price: ₩1,800,000 negotiable. DM for details! 💻',
			timestamp: '10 hours ago',
			likes: 234,
			comments: 67,
			shares: 23,
			images: ['/img/posts/macbook.jpg'],
			category: 'Marketplace',
		},
	];

	// Load initial posts
	useEffect(() => {
		setPosts(initialPosts);
	}, []);

	// Infinite scroll handler
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 500
			) {
				if (!loading) {
					loadMorePosts();
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [loading, page]);

	// Load more posts
	const loadMorePosts = () => {
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			const newPosts = initialPosts.map((post) => ({
				...post,
				id: post.id + page * 100,
				timestamp: `${page * 2} hours ago`,
			}));
			setPosts((prev) => [...prev, ...newPosts]);
			setPage((prev) => prev + 1);
			setLoading(false);
		}, 1000);
	};

	const trendingTopics = [
		{ id: 1, name: 'Campus Life', count: 1234, icon: '🎓' },
		{ id: 2, name: 'Study Tips', count: 892, icon: '📚' },
		{ id: 3, name: 'Part-time Jobs', count: 654, icon: '💼' },
		{ id: 4, name: 'Food Deals', count: 543, icon: '🍕' },
		{ id: 5, name: 'Tech Sales', count: 432, icon: '💻' },
	];

	const quickActions = [
		{ id: 1, label: 'Write Post', icon: '📝', link: '/community/write', color: '#667eea' },
		{ id: 2, label: 'Sell Item', icon: '🛒', link: '/mypage/add-product', color: '#10b981' },
		{ id: 3, label: 'Post Job', icon: '💼', link: '/jobs/create', color: '#f59e0b' },
		{ id: 4, label: 'New Event', icon: '📅', link: '/events/create', color: '#ec4899' },
	];

	return (
		<Stack className="homepage-container">
			{/* Hero Banner Section */}
			<Box className="hero-banner">
				<Box className="hero-content">
					<Box className="hero-title">
						<Zap size={32} className="hero-icon" />
						<h1>Welcome to Cuben Community</h1>
					</Box>
					<p className="hero-subtitle">
						Connect with students, discover opportunities, and trade items all in one place
					</p>

					{/* Quick Actions */}
					<Stack className="quick-actions">
						{quickActions.map((action) => (
							<Link key={action.id} href={action.link} style={{ textDecoration: 'none' }}>
								<Box className="quick-action-card" style={{ borderColor: action.color }}>
									<Box className="action-icon" style={{ background: action.color }}>
										{action.icon}
									</Box>
									<span>{action.label}</span>
								</Box>
							</Link>
						))}
					</Stack>
				</Box>
			</Box>

			{/* Main Content Area */}
			<Stack className="main-content">
				{/* Left Sidebar - Trending */}
				<Box className="left-sidebar">
					{/* Trending Topics */}
					<Box className="trending-card">
						<Box className="card-header">
							<Flame size={20} className="header-icon flame" />
							<h3>Trending Topics</h3>
						</Box>
						<Stack className="trending-list">
							{trendingTopics.map((topic, index) => (
								<Link key={topic.id} href={`/search?q=${topic.name}`} style={{ textDecoration: 'none' }}>
									<Box className="trending-item">
										<Box className="trending-info">
											<span className="trend-icon">{topic.icon}</span>
											<Box className="trend-details">
												<span className="trend-name">{topic.name}</span>
												<span className="trend-count">{topic.count.toLocaleString()} posts</span>
											</Box>
										</Box>
										<Box className="trend-rank">#{index + 1}</Box>
									</Box>
								</Link>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Center Feed - Infinite Scroll */}
				<Box className="center-feed">
					{/* Create Post Box */}
					<Box className="create-post-box">
						<Avatar className="user-avatar" src="/img/profile/defaultUser.svg" />
						<Link href="/community/write" style={{ textDecoration: 'none', flex: 1 }}>
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

					{/* Posts Feed - Infinite */}
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
										<Heart size={16} /> {post.likes} likes
									</span>
									<span>
										<MessageCircle size={16} /> {post.comments} comments
									</span>
									<span>
										<Share2 size={16} /> {post.shares} shares
									</span>
								</Box>

								{/* Post Actions */}
								<Box className="post-actions">
									<Button className="action-btn">
										<Heart size={20} />
										Like
									</Button>
									<Button className="action-btn">
										<MessageCircle size={20} />
										Comment
									</Button>
									<Button className="action-btn">
										<Share2 size={20} />
										Share
									</Button>
									<Button className="action-btn">
										<Bookmark size={20} />
										Save
									</Button>
								</Box>
							</Box>
						))}

						{/* Loading Indicator */}
						{loading && (
							<Box className="loading-indicator">
								<CircularProgress size={40} />
								<p>Loading more posts...</p>
							</Box>
						)}
					</Stack>
				</Box>

				{/* Right Sidebar - Compact Info */}
				<Box className="right-sidebar">
					{/* Quick Stats */}
					<Box className="stats-card">
						<Box className="card-header">
							<Zap size={20} className="header-icon" />
							<h3>Quick Stats</h3>
						</Box>
						<Stack className="stats-list">
							<Box className="stat-item">
								<Briefcase size={20} className="stat-icon job" />
								<Box className="stat-content">
									<h4>500+</h4>
									<p>Job Opportunities</p>
								</Box>
							</Box>
							<Box className="stat-item">
								<ShoppingBag size={20} className="stat-icon market" />
								<Box className="stat-content">
									<h4>1.2K+</h4>
									<p>Items for Sale</p>
								</Box>
							</Box>
						</Stack>
					</Box>

					{/* Jobs CTA */}
					<Box className="cta-card jobs">
						<Briefcase size={32} className="cta-icon" />
						<h3>Find Your Next Opportunity</h3>
						<p>Browse internships and part-time jobs</p>
						<Link href="/jobs" style={{ textDecoration: 'none' }}>
							<Button className="cta-btn">
								View All Jobs
								<ArrowRight size={18} />
							</Button>
						</Link>
					</Box>

					{/* Marketplace CTA */}
					<Box className="cta-card marketplace">
						<ShoppingBag size={32} className="cta-icon" />
						<h3>Student Marketplace</h3>
						<p>Buy and sell items with fellow students</p>
						<Link href="/product" style={{ textDecoration: 'none' }}>
							<Button className="cta-btn">
								Browse Items
								<ArrowRight size={18} />
							</Button>
						</Link>
					</Box>

					{/* Footer Links */}
					<Box className="footer-links">
						<Link href="/about">About</Link>
						<span>•</span>
						<Link href="/help">Help</Link>
						<span>•</span>
						<Link href="/terms">Terms</Link>
						<span>•</span>
						<Link href="/privacy">Privacy</Link>
						<p className="copyright">© 2025 Cuben. All rights reserved.</p>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(Homepage);