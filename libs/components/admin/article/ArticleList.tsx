import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { REACT_APP_API_URL } from '../../../config';
import { Article } from '../../../types/article/article';
import { ArticleStatus, ArticleCategory } from '../../../enums/article.enum';
import { ArticleUpdate } from '../../../types/article/article.update';

interface ArticlePanelListProps {
  articles: Article[];
  anchorEl: HTMLElement | null;
  selectedArticleId: string | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, articleId: string) => void;
  handleMenuClose: () => void;
  updateArticleHandler: (articleId: string, update: Partial<ArticleUpdate>) => void;
  removeArticleHandler: (articleId: string) => void;
}

const statusOptions = Object.values(ArticleStatus);

export const ArticlePanelList = (props: ArticlePanelListProps) => {
  const {
    articles,
    anchorEl,
    selectedArticleId,
    handleMenuOpen,
    handleMenuClose,
    updateArticleHandler,
    removeArticleHandler,
  } = props;

  const isMenuOpen = Boolean(anchorEl && selectedArticleId);
  const currentArticle = selectedArticleId
    ? articles.find((a) => a._id === selectedArticleId)
    : null;

  return (
    <TableContainer className="member-table">
      <Table stickyHeader aria-label="articles table">
        <TableHead>
          <TableRow>
            <TableCell>Article</TableCell>
            <TableCell align="center">Author</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Views / Likes</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                <Typography color="textSecondary">No articles found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow hover key={article._id}>
                {/* Article Info */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/community/article/${article._id}`} target="_blank">
                      <Avatar
                        variant="rounded"
                        src={
                          article.articleImage
                            ? `${REACT_APP_API_URL}/${article.articleImage}`
                            : '/img/default-article.png'
                        }
                        sx={{ width: 56, height: 56, borderRadius: '10px', border: '1px solid #e2e8f0' }}
                      />
                    </Link>
                    <Box sx={{ maxWidth: '320px' }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '14.5px',
                          color: '#1e293b',
                          lineHeight: 1.4,
                        }}
                      >
                        {article.articleTitle || '—'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
                        ID: {article._id.toString().slice(-6)} • {new Date(article.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                    {article.memberData?.memberNick || '—'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#6366f1',
                      textTransform: 'capitalize',
                    }}
                  >
                    {article.articleCategory?.toLowerCase().replace('_', ' ') || '—'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                      {article.articleViews ?? 0} views
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#f59e0b' }}>
                      • {article.articleLikes ?? 0} likes
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, article._id)}
                    className={`badge ${article.articleStatus}`}
                    sx={{ minWidth: 92, textTransform: 'uppercase', fontSize: '12.5px' }}
                  >
                    {article.articleStatus}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { minWidth: 160 } }}
      >
        {statusOptions
          .filter((s) => s !== currentArticle?.articleStatus)
          .map((status) => (
            <MenuItem
              key={status}
              onClick={() => {
                if (selectedArticleId) {
                  updateArticleHandler(selectedArticleId, { articleStatus: status });
                }
              }}
              sx={{
                color: status === ArticleStatus.DELETE ? '#ef4444' : undefined,
                fontWeight: status === ArticleStatus.DELETE ? 600 : 400,
              }}
            >
              {status}
            </MenuItem>
          ))}

        <MenuItem
          onClick={() => selectedArticleId && removeArticleHandler(selectedArticleId)}
          sx={{ color: '#ef4444', fontWeight: 600 }}
        >
          Permanently Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};