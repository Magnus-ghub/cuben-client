import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Stack, MenuItem } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import { TabContext } from '@mui/lab';
import { MessageSquare, Filter } from 'lucide-react';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../../libs/types/common';
import { AllArticlesInquiry } from '../../../libs/types/article/article.input';
import { Article } from '../../../libs/types/article/article';
import { REMOVE_ARTICLE_BY_ADMIN, UPDATE_ARTICLE_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { GET_ALL_ARTICLES_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { ArticleCategory, ArticleStatus } from '../../../libs/enums/article.enum';
import { ArticleUpdate } from '../../../libs/types/article/article.update';

const AdminCommunity: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [communityInquiry, setCommunityInquiry] = useState<AllArticlesInquiry>(initialInquiry);
	const [articles, setArticles] = useState<Article[]>([]);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [value, setValue] = useState(
		communityInquiry?.search?.articleStatus ? communityInquiry?.search?.articleStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateBoardArticleByAdmin] = useMutation(UPDATE_ARTICLE_BY_ADMIN);
	const [removeBoardArticleByAdmin] = useMutation(REMOVE_ARTICLE_BY_ADMIN);

	const {
		loading: getAllBoardArticlesByAdminLoading,
		data: getAllBoardArticlesByAdminData,
		error: getAllBoardArticlesByAdminError,
		refetch: getAllBoardArticlesByAdminRefetch,
	} = useQuery(GET_ALL_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: communityInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setArticles(data?.getAllBoardArticlesByAdmin?.list);
			setArticleTotal(data?.getAllBoardArticlesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllBoardArticlesByAdminRefetch({ input: communityInquiry }).then();
	}, [communityInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		communityInquiry.page = newPage + 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		communityInquiry.limit = parseInt(event.target.value, 10);
		communityInquiry.page = 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setCommunityInquiry({ ...communityInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setCommunityInquiry({ ...communityInquiry, search: { articleStatus: ArticleStatus.ACTIVE } });
				break;
			case 'DELETE':
				setCommunityInquiry({ ...communityInquiry, search: { articleStatus: ArticleStatus.DELETE } });
				break;
			default:
				delete communityInquiry?.search?.articleStatus;
				setCommunityInquiry({ ...communityInquiry });
				break;
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setCommunityInquiry({
					...communityInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...communityInquiry.search,
						articleCategory: newValue as ArticleCategory,
					},
				});
			} else {
				delete communityInquiry?.search?.articleCategory;
				setCommunityInquiry({ ...communityInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateArticleHandler = async (updateData: ArticleUpdate) => {
		try {
			await updateBoardArticleByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const removeArticleHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to remove?')) {
				await removeBoardArticleByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	console.log('+communityInquiry', communityInquiry);
	console.log('+articles', articles);

	return (
        <Box className="admin-users-container">
            <Box className="page-header">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography className="tit">Hamjamiyat Moderatsiyasi</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Talabalar tomonidan qoldirilgan maqolalar, savollar va muhokamalarni boshqarish
                        </Typography>
                    </Box>
                    <MessageSquare size={40} color="#6366f1" opacity={0.2} />
                </Stack>
            </Box>

            <Box className="table-wrap">
                <TabContext value={value}>
                    <List className="tab-menu">
                        {['ALL', 'ACTIVE', 'DELETE'].map((status) => (
                            <ListItem
                                key={status}
                                onClick={(e) => tabChangeHandler(e, status)}
                                className={value === status ? 'li on' : 'li'}
                            >
                                {status === 'ALL' ? 'Barcha postlar' : status}
                            </ListItem>
                        ))}
                    </List>
                    
                    <Divider />

                    <Stack className="search-area" direction="row" alignItems="center" sx={{ p: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Filter size={20} color="#6366f1" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Kategoriya:</Typography>
                            <Select 
                                className="type-select" 
                                value={searchType} 
                                sx={{ minWidth: 200, height: 40, borderRadius: '10px' }}
                            >
                                <MenuItem value="ALL" onClick={() => searchTypeHandler('ALL')}>Barcha ruknlar</MenuItem>
                                {Object.values(ArticleCategory).map((cat) => (
                                    <MenuItem key={cat} value={cat} onClick={() => searchTypeHandler(cat)}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Stack>

                    {/* <CommunityArticleList
                        articles={articles}
                        anchorEl={anchorEl}
                        menuIconClickHandler={menuIconClickHandler}
                        menuIconCloseHandler={menuIconCloseHandler}
                        updateArticleHandler={updateArticleHandler}
                        removeArticleHandler={removeArticleHandler}
                    /> */}

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 40]}
                        component="div"
                        count={articleTotal}
                        rowsPerPage={communityInquiry?.limit}
                        page={communityInquiry?.page - 1}
                        onPageChange={changePageHandler}
                        onRowsPerPageChange={changeRowsPerPageHandler}
                    />
                </TabContext>
            </Box>
        </Box>
    );
};

AdminCommunity.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminCommunity);


