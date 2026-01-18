import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Pagination, Chip, Box } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { T } from '../../libs/types/common';
import { ArticlesInquiry } from '../../libs/types/article/article.input';
import { ArticleCategory } from '../../libs/enums/article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_ARTICLE } from '../../libs/apollo/user/mutation';
import { GET_ARTICLES } from '../../libs/apollo/user/query';
import { gql } from '@apollo/client';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EventIcon from '@mui/icons-material/Event';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SchoolIcon from '@mui/icons-material/School';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Article } from '../../libs/types/article/article';
import ArticleCard from '../../libs/components/community/ArticleCard';

const GET_CATEGORY_COUNTS = gql`
	query GetCategoryCounts {
		careerCount: getArticles(input: { page: 1, limit: 1, search: { articleCategory: CAREER } }) {
			metaCounter {
				total
			}
		}
		eventsCount: getArticles(input: { page: 1, limit: 1, search: { articleCategory: EVENTS } }) {
			metaCounter {
				total
			}
		}
		announcementsCount: getArticles(input: { page: 1, limit: 1, search: { articleCategory: ANNOUNCEMENTS } }) {
			metaCounter {
				total
			}
		}
		knowledgeCount: getArticles(input: { page: 1, limit: 1, search: { articleCategory: KNOWLEDGE } }) {
			metaCounter {
				total
			}
		}
	}
`;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Articles: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = (query?.articleCategory as string) || ArticleCategory.CAREER;

	const [searchCommunity, setSearchCommunity] = useState<ArticlesInquiry>({
		...initialInput,
		search: {
			...initialInput.search,
			articleCategory: articleCategory as ArticleCategory,
		},
	});
	const [articles, setArticles] = useState<Article[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [categoryCounts, setCategoryCounts] = useState({
		[ArticleCategory.CAREER]: 0,
		[ArticleCategory.EVENTS]: 0,
		[ArticleCategory.ANNOUNCEMENTS]: 0,
		[ArticleCategory.KNOWLEDGE]: 0,
	});

	/** APOLLO REQUESTS **/
	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);

	// Fetch category counts
	const { refetch: refetchCounts } = useQuery(GET_CATEGORY_COUNTS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			setCategoryCounts({
				[ArticleCategory.CAREER]: data?.careerCount?.metaCounter[0]?.total || 0,
				[ArticleCategory.EVENTS]: data?.eventsCount?.metaCounter[0]?.total || 0,
				[ArticleCategory.ANNOUNCEMENTS]: data?.announcementsCount?.metaCounter[0]?.total || 0,
				[ArticleCategory.KNOWLEDGE]: data?.knowledgeCount?.metaCounter[0]?.total || 0,
			});
		},
	});

	// Fetch articles for current category
	const { loading: getArticlesLoading, refetch: articlesRefetch } = useQuery(GET_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getArticles?.list || []);
			setTotalCount(data?.getArticles?.metaCounter[0]?.total || 0);
		},
		onError: (error) => {
			console.error('Articles fetch error:', error);
			sweetMixinErrorAlert('Error loading articles: ' + error.message);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: ArticleCategory.CAREER },
				},
				undefined,
				{ shallow: true },
			);
		}
	}, []);

	useEffect(() => {
		if (articleCategory && articleCategory !== searchCommunity.search.articleCategory) {
			const newSearch: ArticlesInquiry = {
				...searchCommunity,
				page: 1,
				search: {
					...searchCommunity.search,
					articleCategory: articleCategory as ArticleCategory,
				},
			};
			setSearchCommunity(newSearch);
			articlesRefetch({ input: newSearch });
		}
	}, [articleCategory]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		const newSearch: ArticlesInquiry = {
			...searchCommunity,
			page: 1,
			search: {
				...searchCommunity.search,
				articleCategory: value as ArticleCategory,
			},
		};

		setSearchCommunity(newSearch);

		await router.push(
			{
				pathname: '/article',
				query: { articleCategory: value },
			},
			undefined,
			{ shallow: true },
		);

		try {
			await articlesRefetch({ input: newSearch });
		} catch (error) {
			console.error('Refetch error:', error);
		}
	};

	const paginationHandler = async (e: T, value: number) => {
		const newSearch: ArticlesInquiry = {
			...searchCommunity,
			page: value,
		};

		setSearchCommunity(newSearch);

		try {
			await articlesRefetch({ input: newSearch });
		} catch (error) {
			console.error('Pagination refetch error:', error);
		}

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			e.preventDefault();
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetArticle({
				variables: { input: id },
			});

			await articlesRefetch({ input: searchCommunity });
			await refetchCounts(); 
			await sweetTopSmallSuccessAlert('Liked!', 800);
		} catch (err: any) {
			console.error('Like error:', err);
			sweetMixinErrorAlert(err.message);
		}
	};

	const getCategoryCount = (category: ArticleCategory) => {
		return categoryCounts[category] || 0;
	};

	if (device === 'mobile') {
		return <h1>ARTICLES PAGE MOBILE</h1>;
	}
	return (
		<div id="articles-page">
			<div className="container">
				<TabContext value={searchCommunity.search.articleCategory}>
					{/* Hero Header Section */}
					<Stack className="articles-hero">
						<Stack className="hero-content">
							<Stack className="hero-left">
								<Typography className="hero-subtitle">Discover Your Future</Typography>
								<Typography className="hero-title">Your Smart Campus Companion</Typography>
								<Typography className="hero-description">
									An official platform where university staff share announcements, events, and academic resources.
								</Typography>
							</Stack>
							<Stack className="hero-right">
								<Stack className="hero-stats-grid">
									<Stack className="hero-stat-item">
										<Box className="stat-icon-box career">💼</Box>
										<Stack className="stat-info">
											<Typography className="stat-number">{categoryCounts[ArticleCategory.CAREER]}</Typography>
											<Typography className="stat-label">Career Articles</Typography>
										</Stack>
									</Stack>
									<Stack className="hero-stat-item">
										<Box className="stat-icon-box events">🎉</Box>
										<Stack className="stat-info">
											<Typography className="stat-number">{categoryCounts[ArticleCategory.EVENTS]}</Typography>
											<Typography className="stat-label">Events</Typography>
										</Stack>
									</Stack>
									<Stack className="hero-stat-item">
										<Box className="stat-icon-box news">📰</Box>
										<Stack className="stat-info">
											<Typography className="stat-number">{categoryCounts[ArticleCategory.ANNOUNCEMENTS]}</Typography>
											<Typography className="stat-label">News</Typography>
										</Stack>
									</Stack>
									<Stack className="hero-stat-item">
										<Box className="stat-icon-box resources">📚</Box>
										<Stack className="stat-info">
											<Typography className="stat-number">{categoryCounts[ArticleCategory.KNOWLEDGE]}</Typography>
											<Typography className="stat-label">Knowledge</Typography>
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
							<Stack className="sidebar-widget categories-widget">
								<Stack className="widget-header">
									<Typography className="widget-title">📁 Categories</Typography>
								</Stack>
								<TabList
									orientation="vertical"
									onChange={tabChangeHandler}
									TabIndicatorProps={{ style: { display: 'none' } }}
								>
									<Tab
										value={ArticleCategory.CAREER}
										label={
											<Stack className="tab-label-content">
												<Stack className="tab-label-left">
													<WorkOutlineIcon className="tab-icon" />
													<Typography className="tab-text">Career & Jobs</Typography>
												</Stack>
												<Chip label={getCategoryCount(ArticleCategory.CAREER)} size="small" className="tab-badge" />
											</Stack>
										}
										className={`category-tab ${
											searchCommunity.search.articleCategory === ArticleCategory.CAREER ? 'active' : ''
										}`}
									/>
									<Tab
										value={ArticleCategory.EVENTS}
										label={
											<Stack className="tab-label-content">
												<Stack className="tab-label-left">
													<EventIcon className="tab-icon" />
													<Typography className="tab-text">Campus Events</Typography>
												</Stack>
												<Chip label={getCategoryCount(ArticleCategory.EVENTS)} size="small" className="tab-badge" />
											</Stack>
										}
										className={`category-tab ${
											searchCommunity.search.articleCategory === ArticleCategory.EVENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={ArticleCategory.ANNOUNCEMENTS}
										label={
											<Stack className="tab-label-content">
												<Stack className="tab-label-left">
													<NewspaperIcon className="tab-icon" />
													<Typography className="tab-text">University News</Typography>
												</Stack>
												<Chip
													label={getCategoryCount(ArticleCategory.ANNOUNCEMENTS)}
													size="small"
													className="tab-badge"
												/>
											</Stack>
										}
										className={`category-tab ${
											searchCommunity.search.articleCategory === ArticleCategory.ANNOUNCEMENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={ArticleCategory.KNOWLEDGE}
										label={
											<Stack className="tab-label-content">
												<Stack className="tab-label-left">
													<SchoolIcon className="tab-icon" />
													<Typography className="tab-text">Knowledge</Typography>
												</Stack>
												<Chip label={getCategoryCount(ArticleCategory.KNOWLEDGE)} size="small" className="tab-badge" />
											</Stack>
										}
										className={`category-tab ${
											searchCommunity.search.articleCategory === ArticleCategory.KNOWLEDGE ? 'active' : ''
										}`}
									/>
								</TabList>
							</Stack>
						</Stack>

						{/* Right Content Area */}
						<Stack className="content-area">
							{Object.values(ArticleCategory).map((category) => (
								<TabPanel key={category} value={category} className="tab-content">
									{getArticlesLoading ? (
										<Stack className="loading-state">
											<Typography>Loading {category.toLowerCase()}...</Typography>
										</Stack>
									) : (
										<Stack className="articles-grid">
											{articles.length > 0 ? (
												articles.map((article: Article) => (
													<ArticleCard article={article} likeArticleHandler={likeArticleHandler} key={article._id} />
												))
											) : (
												<Stack className="empty-state">
													<Box className="empty-icon">
														{category === ArticleCategory.CAREER
															? '💼'
															: category === ArticleCategory.EVENTS
															? '🎉'
															: category === ArticleCategory.KNOWLEDGE
															? '📰'
															: '📚'}
													</Box>
													<Typography className="empty-title">No {category.toLowerCase()} available</Typography>
													<Typography className="empty-text">Check back soon for new updates</Typography>
												</Stack>
											)}
										</Stack>
									)}
								</TabPanel>
							))}
						</Stack>
					</Stack>

					{/* Pagination Section */}
					{totalCount > 0 && (
						<Stack className="pagination-container">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
								disabled={getArticlesLoading}
								sx={{
									'& .MuiPaginationItem-root': { borderRadius: '12px', fontWeight: 600 },
									'& .Mui-selected': {
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: '#fff',
									},
								}}
							/>
							<Typography className="pagination-info">
								Showing page {searchCommunity.page} of {Math.ceil(totalCount / searchCommunity.limit)} • Total{' '}
								{totalCount} articles
							</Typography>
						</Stack>
					)}
				</TabContext>
			</div>
		</div>
	);
};

Articles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			articleCategory: ArticleCategory.CAREER,
		},
	},
};

export default withLayoutMain(Articles);
