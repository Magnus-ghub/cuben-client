import React, { useState } from 'react';
import { Stack, Box, Button, Avatar, Chip } from '@mui/material';
import Link from 'next/link';
import {
	TrendingUp,
	Flame,
	Calendar,
	Briefcase,
	Users,
	Heart,
	MessageCircle,
	Bookmark,
	MoreHorizontal,
	Image as ImageIcon,
	Video,
	Smile,
	Clock,
	MapPin,
	DollarSign,
	ShoppingBag,
	Zap,
	Award,
} from 'lucide-react';
import withLayoutMain from '../../libs/components/layout/LayoutHome';

const Homepage = () => {
	const [activeTab, setActiveTab] = useState('all');

	// Mock Data - Keyinchalik API dan keladi
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

	const upcomingEvents = [
		{
			id: 1,
			title: 'Tech Career Fair 2025',
			date: 'Jan 25, 2025',
			time: '10:00 AM',
			location: 'Main Hall',
			attendees: 234,
			image: '/img/banner/techcareer.webp',
		},
		{
			id: 2,
			title: 'Winter Festival',
			date: 'Jan 28, 2025',
			time: '2:00 PM',
			location: 'Campus Garden',
			attendees: 456,
			image: '/img/banner/winterfes.jpg',
		},
	];

	const featuredJobs = [
		{
			id: 1,
			title: 'Frontend Developer Intern',
			company: 'Apple Company',
			location: 'Seoul, Korea',
			salary: '₩2,500,000/month',
			type: 'Internship',
			logo: '/img/logo/apple.gif',
			posted: '2 days ago',
		},
		{
			id: 2,
			title: 'Marketing Assistant',
			company: 'Naver Corporation',
			location: 'Busan, Korea',
			salary: '₩2,000,000/month',
			type: 'Part-time',
			logo: '/img/logo/naver.png',
			posted: '5 days ago',
		},
	];

	const featuredProducts = [
		{
			id: 1,
			title: 'MacBook Pro M3 2023',
			price: '₩1,500,000',
			condition: 'Like New',
			seller: 'John Kim',
			image: '/img/product/macbookpro.jpeg',
			category: 'Electronics',
		},
		{
			id: 2,
			title: 'Calculus Textbook Bundle',
			price: '₩45,000',
			condition: 'Good',
			seller: 'Sarah Lee',
			image: '/img/product/textbook.webp',
			category: 'Books',
		},
		{
			id: 3,
			title: 'Gaming Keyboard & Mouse',
			price: '₩80,000',
			condition: 'Excellent',
			seller: 'Mike Park',
			image: '/img/product/gamingkey.webp',
			category: 'Electronics',
		},
	];

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
			id: 2,
			author: {
				name: 'David Chen',
				username: '@davidchen',
				avatar: '/img/profile/magnus.png',
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
			id: 2,
			author: {
				name: 'David Chen',
				username: '@davidchen',
				avatar: '/img/profile/magnus.png',
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
			id: 2,
			author: {
				name: 'David Chen',
				username: '@davidchen',
				avatar: '/img/profile/magnus.png',
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
			id: 2,
			author: {
				name: 'David Chen',
				username: '@davidchen',
				avatar: '/img/profile/magnus.png',
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
				{/* Left Sidebar - Trending & Events */}
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

					{/* Upcoming Events */}
					<Box className="events-card">
						<Box className="card-header">
							<Calendar size={20} className="header-icon" />
							<h3>Upcoming Events</h3>
							<Link href="/community" className="view-all-link">
								View All
							</Link>
						</Box>
						<Stack className="events-list">
							{upcomingEvents.map((event) => (
								<Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
									<Box className="event-item">
										<Box className="event-image">
											<img src={event.image} alt={event.title} />
										</Box>
										<Box className="event-details">
											<h4>{event.title}</h4>
											<Box className="event-meta">
												<span>
													<Clock size={14} /> {event.date} • {event.time}
												</span>
												<span>
													<MapPin size={14} /> {event.location}
												</span>
												<span>
													<Users size={14} /> {event.attendees} attending
												</span>
											</Box>
										</Box>
									</Box>
								</Link>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Center Feed */}
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
										<Heart size={16} /> {post.likes} likes
									</span>
									<span>
										<MessageCircle size={16} /> {post.comments} comments
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
										<Bookmark size={20} />
										Save
									</Button>
								</Box>
							</Box>
						))}
					</Stack>
				</Box>

				{/* Right Sidebar - Jobs & Marketplace */}
				<Box className="right-sidebar">
					{/* Featured Jobs */}
					<Box className="jobs-card">
						<Box className="card-header">
							<Briefcase size={20} className="header-icon" />
							<h3>Featured Jobs</h3>
							<Link href="/community" className="view-all-link">
								View All
							</Link>
						</Box>
						<Stack className="jobs-list">
							{featuredJobs.map((job) => (
								<Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
									<Box className="job-item">
										<Box className="job-header">
											<img src={job.logo} alt={job.company} className="company-logo" />
											<Chip label={job.type} size="small" className="job-type" />
										</Box>
										<h4>{job.title}</h4>
										<p className="company-name">{job.company}</p>
										<Box className="job-details">
											<span>
												<MapPin size={14} /> {job.location}
											</span>
											<span>
												<DollarSign size={14} /> {job.salary}
											</span>
										</Box>
										<Box className="job-footer">
											<span className="job-posted">{job.posted}</span>
											<Button size="small" className="apply-btn">
												Apply Now
											</Button>
										</Box>
									</Box>
								</Link>
							))}
						</Stack>
					</Box>

					{/* Featured Marketplace */}
					<Box className="marketplace-card">
						<Box className="card-header">
							<ShoppingBag size={20} className="header-icon" />
							<h3>Marketplace Picks</h3>
							<Link href="/product" className="view-all-link">
								View All
							</Link>
						</Box>
						<Stack className="products-grid">
							{featuredProducts.map((product) => (
								<Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
									<Box className="product-item">
										<Box className="product-image">
											<img src={product.image} alt={product.title} />
											<Chip label={product.condition} size="small" className="product-condition" />
										</Box>
										<Box className="product-info">
											<h4>{product.title}</h4>
											<p className="product-price">{product.price}</p>
											<Box className="product-meta">
												<span className="seller-name">{product.seller}</span>
												<Chip label={product.category} size="small" />
											</Box>
										</Box>
									</Box>
								</Link>
							))}
						</Stack>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};
export default withLayoutMain(Homepage);