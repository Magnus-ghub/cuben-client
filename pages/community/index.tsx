import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Pagination, Chip, Box } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../libs/apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../libs/apollo/user/query';
import Link from 'next/link';
import OpportunityCard from './detail';

const Opportunities: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchOpportunity, setSearchOpportunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getBoardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchOpportunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'CAREER' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		setSearchOpportunity({
			...searchOpportunity,
			page: 1,
			search: { articleCategory: value as BoardArticleCategory },
		});
		await router.push(
			{
				pathname: '/opportunities',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchOpportunity({ ...searchOpportunity, page: value });
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

			await boardArticlesRefetch({ input: searchOpportunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>OPPORTUNITIES PAGE MOBILE</h1>;
	} else {
		return (
			<div id="opportunities-page">
				<div className="container">
					<TabContext value={searchOpportunity.search.articleCategory}>
						{/* Hero Header Section with Stats */}
						<Stack className="opportunities-hero">
							{/* Left side - Text Content */}
							<Stack className="hero-left">
								<Typography className="hero-title">
									University
									<br />
									Opportunities Hub
								</Typography>
								<Typography className="hero-subtitle">
									Discover career opportunities, campus events, and latest university news all in one place
								</Typography>

								{/* Stats Cards */}
								<Stack className="hero-stats">
									<Stack className="stat-item">
										<Box className="stat-icon">📊</Box>
										<Stack className="stat-text">
											<Typography className="stat-number">{totalCount || 0}</Typography>
											<Typography className="stat-label">Active Posts</Typography>
										</Stack>
									</Stack>
									<Stack className="stat-item">
										<Box className="stat-icon">💼</Box>
										<Stack className="stat-text">
											<Typography className="stat-number">24</Typography>
											<Typography className="stat-label">Job Openings</Typography>
										</Stack>
									</Stack>
									<Stack className="stat-item">
										<Box className="stat-icon">🎉</Box>
										<Stack className="stat-text">
											<Typography className="stat-number">12</Typography>
											<Typography className="stat-label">Upcoming Events</Typography>
										</Stack>
									</Stack>
									<Stack className="stat-item">
										<Box className="stat-icon">📰</Box>
										<Stack className="stat-text">
											<Typography className="stat-number">18</Typography>
											<Typography className="stat-label">Latest News</Typography>
										</Stack>
									</Stack>
								</Stack>
							</Stack>

							{/* Right side - Current Category Info */}
							<Stack className="hero-right">
								<TabPanel value="CAREER" className="category-info-panel">
									<Stack className="category-info-card">
										<Box className="category-icon">💼</Box>
										<Typography className="category-title">Career Opportunities</Typography>
										<Typography className="category-desc">
											Explore exciting job openings and career development opportunities at BUFS
										</Typography>
										<Stack className="category-count">
											<Typography className="count-number">{totalCount}</Typography>
											<Typography className="count-label">positions</Typography>
										</Stack>
									</Stack>
								</TabPanel>

								<TabPanel value="EVENTS" className="category-info-panel">
									<Stack className="category-info-card">
										<Box className="category-icon">🎉</Box>
										<Typography className="category-title">Campus Events</Typography>
										<Typography className="category-desc">
											Stay updated with workshops, seminars, festivals and cultural celebrations
										</Typography>
										<Stack className="category-count">
											<Typography className="count-number">{totalCount}</Typography>
											<Typography className="count-label">events</Typography>
										</Stack>
									</Stack>
								</TabPanel>

								<TabPanel value="KNOWLEDGE" className="category-info-panel">
									<Stack className="category-info-card">
										<Box className="category-icon">📰</Box>
										<Typography className="category-title">University News</Typography>
										<Typography className="category-desc">
											Latest announcements, achievements, and important updates from BUFS
										</Typography>
										<Stack className="category-count">
											<Typography className="count-number">{totalCount}</Typography>
											<Typography className="count-label">articles</Typography>
										</Stack>
									</Stack>
								</TabPanel>

								<TabPanel value="HELP" className="category-info-panel">
									<Stack className="category-info-card">
										<Box className="category-icon">📚</Box>
										<Typography className="category-title">Resources & Support</Typography>
										<Typography className="category-desc">
											Access helpful resources, guides and support from university administration
										</Typography>
										<Stack className="category-count">
											<Typography className="count-number">{totalCount}</Typography>
											<Typography className="count-label">resources</Typography>
										</Stack>
									</Stack>
								</TabPanel>
							</Stack>
						</Stack>

						{/* Main Content Layout */}
						<Stack className="main-layout">
							{/* Left Sidebar - Categories */}
							<Stack className="left-sidebar">
								{/* Categories Widget */}
								<Stack className="sidebar-widget categories-widget">
									<Stack className="widget-header">
										<Typography className="widget-title">Categories</Typography>
										<Chip
											label={totalCount || 0}
											size="small"
											sx={{
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												color: '#fff',
												fontWeight: 700,
												fontSize: '12px',
											}}
										/>
									</Stack>
									<TabList
										orientation="vertical"
										aria-label="opportunity categories"
										TabIndicatorProps={{
											style: { display: 'none' },
										}}
										onChange={tabChangeHandler}
									>
										<Tab
											value={'CAREER'}
											label={'Career & Jobs'}
											icon={<span className="tab-icon">💼</span>}
											iconPosition="start"
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'CAREER' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'EVENTS'}
											label={'Campus Events'}
											icon={<span className="tab-icon">🎉</span>}
											iconPosition="start"
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'EVENTS' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'KNOWLEDGE'}
											label={'University News'}
											icon={<span className="tab-icon">📰</span>}
											iconPosition="start"
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'KNOWLEDGE' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'HELP'}
											label={'Resources'}
											icon={<span className="tab-icon">📚</span>}
											iconPosition="start"
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'HELP' ? 'active' : ''
											}`}
										/>
									</TabList>
								</Stack>

								{/* Featured Jobs Widget */}
								<Stack className="sidebar-widget featured-widget">
									<Stack className="widget-header">
										<Typography className="widget-title">🔥 Featured Jobs</Typography>
										<Link href="/opportunities?articleCategory=CAREER">
											<Typography className="view-all-link">View All</Typography>
										</Link>
									</Stack>
									<Stack className="featured-list">
										<Stack className="featured-item">
											<Box className="featured-icon">👨‍🏫</Box>
											<Stack className="featured-info">
												<Typography className="featured-title">English Lecturer</Typography>
												<Typography className="featured-meta">Full-time • ₩3.8M</Typography>
											</Stack>
										</Stack>
										<Stack className="featured-item">
											<Box className="featured-icon">💻</Box>
											<Stack className="featured-info">
												<Typography className="featured-title">IT Support Specialist</Typography>
												<Typography className="featured-meta">Full-time • ₩3.2M</Typography>
											</Stack>
										</Stack>
										<Stack className="featured-item">
											<Box className="featured-icon">📊</Box>
											<Stack className="featured-info">
												<Typography className="featured-title">Research Assistant</Typography>
												<Typography className="featured-meta">Part-time • ₩2.5M</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								{/* Upcoming Events Widget */}
								<Stack className="sidebar-widget events-widget">
									<Stack className="widget-header">
										<Typography className="widget-title">📅 Upcoming Events</Typography>
										<Link href="/opportunities?articleCategory=EVENTS">
											<Typography className="view-all-link">View All</Typography>
										</Link>
									</Stack>
									<Stack className="events-list">
										<Stack className="event-item">
											<Stack className="event-date">
												<Typography className="date-day">15</Typography>
												<Typography className="date-month">JAN</Typography>
											</Stack>
											<Stack className="event-info">
												<Typography className="event-title">Career Fair 2025</Typography>
												<Typography className="event-time">10:00 AM - 4:00 PM</Typography>
											</Stack>
										</Stack>
										<Stack className="event-item">
											<Stack className="event-date">
												<Typography className="date-day">20</Typography>
												<Typography className="date-month">JAN</Typography>
											</Stack>
											<Stack className="event-info">
												<Typography className="event-title">International Week</Typography>
												<Typography className="event-time">All Day Event</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								{/* Quick Links Widget */}
								<Stack className="sidebar-widget links-widget">
									<Typography className="widget-title">🔗 Quick Links</Typography>
									<Stack className="links-list">
										<a href="#" className="quick-link">
											<span className="link-icon">🏆</span>
											<Typography>Career Center</Typography>
										</a>
										<a href="#" className="quick-link">
											<span className="link-icon">👥</span>
											<Typography>Student Portal</Typography>
										</a>
										<a href="#" className="quick-link">
											<span className="link-icon">📅</span>
											<Typography>Event Calendar</Typography>
										</a>
									</Stack>
								</Stack>
							</Stack>

							{/* Right Content - Cards Grid */}
							<Stack className="content-area">
								<TabPanel value="CAREER" className="tab-content">
									<Stack className="opportunities-grid">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<OpportunityCard
														boardArticle={boardArticle}
														likeArticleHandler={likeArticleHandler}
														key={boardArticle?._id}
													/>
												);
											})
										) : (
											<Stack className="empty-state">
												<Box className="empty-icon">💼</Box>
												<Typography className="empty-title">No career opportunities available</Typography>
												<Typography className="empty-text">
													Check back soon for exciting new job postings from the university
												</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="EVENTS" className="tab-content">
									<Stack className="opportunities-grid">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<OpportunityCard
														boardArticle={boardArticle}
														likeArticleHandler={likeArticleHandler}
														key={boardArticle?._id}
													/>
												);
											})
										) : (
											<Stack className="empty-state">
												<Box className="empty-icon">🎉</Box>
												<Typography className="empty-title">No upcoming events</Typography>
												<Typography className="empty-text">New exciting campus events will be announced soon</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="KNOWLEDGE" className="tab-content">
									<Stack className="opportunities-grid">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<OpportunityCard
														boardArticle={boardArticle}
														likeArticleHandler={likeArticleHandler}
														key={boardArticle?._id}
													/>
												);
											})
										) : (
											<Stack className="empty-state">
												<Box className="empty-icon">📰</Box>
												<Typography className="empty-title">No news available</Typography>
												<Typography className="empty-text">
													Stay tuned for the latest university updates and announcements
												</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="HELP" className="tab-content">
									<Stack className="opportunities-grid">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<OpportunityCard
														boardArticle={boardArticle}
														likeArticleHandler={likeArticleHandler}
														key={boardArticle?._id}
													/>
												);
											})
										) : (
											<Stack className="empty-state">
												<Box className="empty-icon">📚</Box>
												<Typography className="empty-title">No resources available</Typography>
												<Typography className="empty-text">Helpful resources and guides will be added soon</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>
							</Stack>
						</Stack>

						{/* Pagination Section */}
						{totalCount > 0 && (
							<Stack className="pagination-container">
								<Pagination
									count={Math.ceil(totalCount / searchOpportunity.limit)}
									page={searchOpportunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
									sx={{
										'& .MuiPaginationItem-root': {
											borderRadius: '12px',
											fontWeight: 600,
											fontSize: '14px',
										},
										'& .Mui-selected': {
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: '#fff',
										},
									}}
								/>
								<Typography className="pagination-info">
									Showing page {searchOpportunity.page} of {Math.ceil(totalCount / searchOpportunity.limit)} • Total{' '}
									{totalCount} posts
								</Typography>
							</Stack>
						)}
					</TabContext>
				</div>
			</div>
		);
	}
};

Opportunities.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			articleCategory: 'CAREER',
		},
	},
};

export default withLayoutMain(Opportunities);