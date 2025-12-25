import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Pagination, Chip } from '@mui/material';
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
		setSearchOpportunity({ ...searchOpportunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
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
						{/* Header Section */}
						<Stack className="opportunities-header">
							<Stack className="header-content">
								<Typography className="main-title">Campus Opportunities</Typography>
								<Typography className="subtitle">
									Discover jobs, events, and resources posted by university administration
								</Typography>
							</Stack>
						</Stack>

						{/* Main Content */}
						<Stack className="main-content">
							{/* Categories Sidebar */}
							<Stack className="categories-sidebar">
								<Stack className="sidebar-header">
									<Typography className="sidebar-title">Categories</Typography>
									<Chip 
										label={totalCount} 
										size="small" 
										sx={{ 
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: '#fff',
											fontWeight: 700
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
										icon={<span>💼</span>}
										iconPosition="start"
										className={`category-tab ${searchOpportunity.search.articleCategory === 'CAREER' ? 'active' : ''}`}
									/>
									<Tab
										value={'KNOWLEDGE'}
										label={'Knowledge Base'}
										icon={<span>📚</span>}
										iconPosition="start"
										className={`category-tab ${searchOpportunity.search.articleCategory === 'KNOWLEDGE' ? 'active' : ''}`}
									/>
									<Tab
										value={'EVENTS'}
										label={'Events'}
										icon={<span>🎉</span>}
										iconPosition="start"
										className={`category-tab ${searchOpportunity.search.articleCategory === 'EVENTS' ? 'active' : ''}`}
									/>
									<Tab
										value={'HELP'}
										label={'Help & Support'}
										icon={<span>💡</span>}
										iconPosition="start"
										className={`category-tab ${searchOpportunity.search.articleCategory === 'HELP' ? 'active' : ''}`}
									/>
								</TabList>
							</Stack>

							{/* Opportunities Content */}
							<Stack className="opportunities-content">
								<TabPanel value="CAREER" className="tab-panel">
									<Stack className="panel-header">
										<Typography className="category-title">Career Opportunities</Typography>
										<Typography className="category-desc">
											Internships, jobs, and career development
										</Typography>
									</Stack>
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
											<Stack className="no-data">
												<img src="/img/icons/empty.svg" alt="" />
												<Typography>No career opportunities available</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="KNOWLEDGE" className="tab-panel">
									<Stack className="panel-header">
										<Typography className="category-title">Knowledge Base</Typography>
										<Typography className="category-desc">
											Guides, tutorials, and educational resources
										</Typography>
									</Stack>
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
											<Stack className="no-data">
												<img src="/img/icons/empty.svg" alt="" />
												<Typography>No knowledge posts available</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="EVENTS" className="tab-panel">
									<Stack className="panel-header">
										<Typography className="category-title">Campus Events</Typography>
										<Typography className="category-desc">
											Workshops, seminars, and social gatherings
										</Typography>
									</Stack>
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
											<Stack className="no-data">
												<img src="/img/icons/empty.svg" alt="" />
												<Typography>No upcoming events</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="HELP" className="tab-panel">
									<Stack className="panel-header">
										<Typography className="category-title">Help & Support</Typography>
										<Typography className="category-desc">
											Get help from university administration
										</Typography>
									</Stack>
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
											<Stack className="no-data">
												<img src="/img/icons/empty.svg" alt="" />
												<Typography>No help posts available</Typography>
											</Stack>
										)}
									</Stack>
								</TabPanel>
							</Stack>
						</Stack>

						{/* Pagination */}
						{totalCount > 0 && (
							<Stack className="pagination-section">
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
										},
										'& .Mui-selected': {
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: '#fff',
										},
									}}
								/>
								<Typography className="total-text">
									Total {totalCount} post{totalCount > 1 ? 's' : ''} available
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