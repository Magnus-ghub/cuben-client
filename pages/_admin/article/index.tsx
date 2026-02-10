import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
  Box,
  List,
  ListItem,
  Stack,
  Typography,
  Divider,
  Select,
  MenuItem,
  TablePagination,
} from '@mui/material';
import { MessageSquare, Filter } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { AllArticlesInquiry } from '../../../libs/types/article/article.input';
import { Article } from '../../../libs/types/article/article';
import { ArticleCategory, ArticleStatus } from '../../../libs/enums/article.enum';
import { ArticleUpdate } from '../../../libs/types/article/article.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { Direction } from '../../../libs/enums/common.enum';
import { GET_ALL_ARTICLES_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { ArticlePanelList } from '../../../libs/components/admin/article/ArticleList';

const AdminArticle: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const [articlesInquiry, setArticlesInquiry] = useState<AllArticlesInquiry>({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: Direction.DESC,
    search: {},
  });

  const [articles, setArticles] = useState<Article[]>([]);
  const [articleTotal, setArticleTotal] = useState<number>(0);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  /** Apollo Query */
  const { loading, data, error, refetch: refetchArticles } = useQuery(GET_ALL_ARTICLES_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: articlesInquiry },
    notifyOnNetworkStatusChange: true,
  });

  // Ma'lumot kelganida state'ni yangilash
  useEffect(() => {
    if (data?.getAllArticlesByAdmin) {
      console.log('Maʼlumot keldi →', data.getAllArticlesByAdmin);
      setArticles(data.getAllArticlesByAdmin.list ?? []);
      setArticleTotal(data.getAllArticlesByAdmin.metaCounter?.[0]?.total ?? 0);
    }
  }, [data]);

  // Xatolik bo'lsa konsolga chiqarish
  useEffect(() => {
    if (error) {
      console.error('GraphQL xatosi:', error);
      console.error('GraphQL errors array:', error.graphQLErrors);
      console.error('Network xatosi:', error.networkError);
    }
  }, [error]);

  // Inquiry o'zgarganda qayta so'rov yuborish
  useEffect(() => {
    console.log('articlesInquiry oʻzgardi →', articlesInquiry);
    refetchArticles({ input: articlesInquiry });
  }, [articlesInquiry, refetchArticles]);

  // articles o'zgarganini kuzatish (debug uchun)
  useEffect(() => {
    console.log('Hozirgi articles state:', articles);
  }, [articles]);

  /** Handlers */
  const handlePageChange = (event: unknown, newPage: number) => {
    setArticlesInquiry((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticlesInquiry((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, articleId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticleId(articleId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedArticleId(null);
  };

  const handleUpdateArticle = async (articleId: string, update: Partial<ArticleUpdate>) => {
    try {
      await updateArticleByAdmin({
        variables: { input: { _id: articleId, ...update } },
      });
      handleCloseMenu();
      await refetchArticles({ input: articlesInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleRemoveArticle = async (articleId: string) => {
    const confirmed = await sweetConfirmAlert('Ushbu maqolani butunlay oʻchirishni xohlaysizmi?');
    if (!confirmed) return;

    try {
      await removeArticleByAdmin({ variables: { input: articleId } });
      handleCloseMenu();
      await refetchArticles({ input: articlesInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleStatusTabChange = (newValue: string) => {
    setFilterStatus(newValue);
    const nextInquiry: AllArticlesInquiry = { ...articlesInquiry, page: 1 };

    if (newValue !== 'ALL') {
      nextInquiry.search = { ...nextInquiry.search, articleStatus: newValue as ArticleStatus };
    } else {
      const { articleStatus, ...rest } = nextInquiry.search ?? {};
      nextInquiry.search = rest;
    }

    setArticlesInquiry(nextInquiry);
  };

  const handleCategoryChange = (newValue: string) => {
    setFilterCategory(newValue);
    const nextInquiry: AllArticlesInquiry = { ...articlesInquiry, page: 1 };

    if (newValue !== 'ALL') {
      nextInquiry.search = { ...nextInquiry.search, articleCategory: newValue as ArticleCategory };
    } else {
      const { articleCategory, ...rest } = nextInquiry.search ?? {};
      nextInquiry.search = rest;
    }

    setArticlesInquiry(nextInquiry);
  };

  return (
    <Box className="admin-users-container">
      <Box className="page-header">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography className="tit">Community Moderation</Typography>
            <Typography variant="body2" color="textSecondary">
              Manage articles, questions and discussions posted by students
            </Typography>
          </Box>
          <MessageSquare size={40} color="#6366f1" opacity={0.2} />
        </Stack>
      </Box>

      <Box className="table-wrap">
        <List className="tab-menu" sx={{ display: 'flex' }}>
          {['ALL', 'ACTIVE', 'DELETE'].map((status) => (
            <ListItem
              key={status}
              onClick={() => handleStatusTabChange(status)}
              className={filterStatus === status ? 'li on' : 'li'}
              sx={{ cursor: 'pointer' }}
            >
              {status === 'ALL' ? 'All Posts' : status.charAt(0) + status.slice(1).toLowerCase()}
            </ListItem>
          ))}
        </List>

        <Divider />

        <Stack direction="row" className="search-area" spacing={3} alignItems="center" sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Filter size={20} color="#6366f1" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Category:
            </Typography>
            <Select
              value={filterCategory}
              onChange={(e) => handleCategoryChange(e.target.value as string)}
              className="type-select"
              sx={{ minWidth: 220, height: 40, borderRadius: '10px' }}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {Object.values(ArticleCategory).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">Maqolalar yuklanmoqda...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 5, textAlign: 'center', color: 'error.main' }}>
            <Typography>Xatolik yuz berdi. Iltimos sahifani yangilang.</Typography>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Box>
        ) : (
          <ArticlePanelList
            articles={articles}
            anchorEl={anchorEl}
            selectedArticleId={selectedArticleId}
            handleMenuOpen={handleOpenMenu}
            handleMenuClose={handleCloseMenu}
            updateArticleHandler={handleUpdateArticle}
            removeArticleHandler={handleRemoveArticle}
          />
        )}

        <TablePagination
          rowsPerPageOptions={[10, 20, 40, 80]}
          component="div"
          count={articleTotal}
          rowsPerPage={articlesInquiry.limit ?? 10}
          page={(articlesInquiry.page ?? 1) - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
};

export default withAdminLayout(AdminArticle);

function updateArticleByAdmin(arg0: { variables: { input: { _id: string; articleStatus?: ArticleStatus; articleCategory?: string; articleTitle?: string; articleContent?: string; articleImage?: string; }; }; }) {
  throw new Error('Function not implemented.');
}
function removeArticleByAdmin(arg0: { variables: { input: string; }; }) {
  throw new Error('Function not implemented.');
}

