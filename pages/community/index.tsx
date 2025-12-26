import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Pagination, Chip, Box } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../libs/apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../libs/apollo/user/query';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
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

	// Get category counts
	const getCategoryCount = (category: string) => {
		if (category === searchOpportunity.search.articleCategory) {
			return totalCount;
		}
		return 0;
	};

	if (device === 'mobile') {
		return <h1>OPPORTUNITIES PAGE MOBILE</h1>;
	} else {
		return (
			<div id="opportunities-page">
				<div className="container">
					<TabContext value={searchOpportunity.search.articleCategory}>
						{/* Hero Header Section */}
						<Stack className="opportunities-hero">
							<Stack className="hero-content">
								<Stack className="hero-left">
									<Typography className="hero-subtitle">Discover Your Future</Typography>
									<Typography className="hero-title">University Opportunities Hub</Typography>
									<Typography className="hero-description">
										Explore career opportunities, campus events, latest news, and educational resources all in one place
									</Typography>
								</Stack>
								<Stack className="hero-right">
									<Stack className="hero-stats-grid">
										<Stack className="hero-stat-item">
											<Box className="stat-icon-box career">💼</Box>
											<Stack className="stat-info">
												<Typography className="stat-number">24</Typography>
												<Typography className="stat-label">Job Openings</Typography>
											</Stack>
										</Stack>
										<Stack className="hero-stat-item">
											<Box className="stat-icon-box events">🎉</Box>
											<Stack className="stat-info">
												<Typography className="stat-number">12</Typography>
												<Typography className="stat-label">Upcoming Events</Typography>
											</Stack>
										</Stack>
										<Stack className="hero-stat-item">
											<Box className="stat-icon-box news">📰</Box>
											<Stack className="stat-info">
												<Typography className="stat-number">18</Typography>
												<Typography className="stat-label">Latest News</Typography>
											</Stack>
										</Stack>
										<Stack className="hero-stat-item">
											<Box className="stat-icon-box resources">📚</Box>
											<Stack className="stat-info">
												<Typography className="stat-number">{totalCount || 0}</Typography>
												<Typography className="stat-label">Total Posts</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>
							</Stack>
						</Stack>

						{/* Main Content Layout */}
						<Stack className="main-layout">
							{/* Left Sidebar */}
							<Stack className="left-sidebar">
								{/* Categories Widget */}
								<Stack className="sidebar-widget categories-widget">
									<Stack className="widget-header">
										<Typography className="widget-title">📁 Categories</Typography>
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
											label={
												<Stack className="tab-label-content">
													<Stack className="tab-label-left">
														<WorkOutlineIcon className="tab-icon" />
														<Typography className="tab-text">Career & Jobs</Typography>
													</Stack>
													{searchOpportunity.search.articleCategory === 'CAREER' && (
														<Chip label={totalCount} size="small" className="tab-badge" />
													)}
												</Stack>
											}
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'CAREER' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'EVENTS'}
											label={
												<Stack className="tab-label-content">
													<Stack className="tab-label-left">
														<EventIcon className="tab-icon" />
														<Typography className="tab-text">Campus Events</Typography>
													</Stack>
													{searchOpportunity.search.articleCategory === 'EVENTS' && (
														<Chip label={totalCount} size="small" className="tab-badge" />
													)}
												</Stack>
											}
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'EVENTS' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'KNOWLEDGE'}
											label={
												<Stack className="tab-label-content">
													<Stack className="tab-label-left">
														<NewspaperIcon className="tab-icon" />
														<Typography className="tab-text">University News</Typography>
													</Stack>
													{searchOpportunity.search.articleCategory === 'KNOWLEDGE' && (
														<Chip label={totalCount} size="small" className="tab-badge" />
													)}
												</Stack>
											}
											className={`category-tab ${
												searchOpportunity.search.articleCategory === 'KNOWLEDGE' ? 'active' : ''
											}`}
										/>
										<Tab
											value={'HELP'}
											label={
												<Stack className="tab-label-content">
													<Stack className="tab-label-left">
														<SchoolIcon className="tab-icon" />
														<Typography className="tab-text">Resources</Typography>
													</Stack>
													{searchOpportunity.search.articleCategory === 'HELP' && (
														<Chip label={totalCount} size="small" className="tab-badge" />
													)}
												</Stack>
											}
											className={`category-tab ${searchOpportunity.search.articleCategory === 'HELP' ? 'active' : ''}`}
										/>
									</TabList>
								</Stack>

								{/* Quick Links Widget */}
								<Stack className="sidebar-widget quick-links-widget">
									<Stack className="widget-header">
										<Typography className="widget-title">🔗 Quick Links</Typography>
									</Stack>
									<Stack className="quick-links-list">
										<Stack className="quick-link-item">
											<TrendingUpIcon className="link-icon" />
											<Typography className="link-text">Career Center</Typography>
										</Stack>
										<Stack className="quick-link-item">
											<PeopleIcon className="link-icon" />
											<Typography className="link-text">Student Portal</Typography>
										</Stack>
										<Stack className="quick-link-item">
											<CalendarTodayIcon className="link-icon" />
											<Typography className="link-text">Event Calendar</Typography>
										</Stack>
										<Stack className="quick-link-item">
											<SchoolIcon className="link-icon" />
											<Typography className="link-text">Academic Resources</Typography>
										</Stack>
									</Stack>
								</Stack>
							</Stack>

							{/* Right Content Area */}
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
												<Typography className="empty-text">
													New exciting campus events will be announced soon
												</Typography>
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