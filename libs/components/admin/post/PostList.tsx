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
import { Post } from '../../../types/post/post'; // adjust path
import { PostStatus } from '../../../enums/post.enum';
import { PostUpdate } from '../../../types/post/post.update'; // adjust path

interface PostPanelListProps {
  posts: Post[];
  anchorEl: HTMLElement | null;
  selectedPostId: string | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, postId: string) => void;
  handleMenuClose: () => void;
  updatePostHandler: (postId: string, update: Partial<PostUpdate>) => void;
  removePostHandler: (postId: string) => void;
}

const statusOptions = Object.values(PostStatus);

export const PostPanelList = (props: PostPanelListProps) => {
  const {
    posts,
    anchorEl,
    selectedPostId,
    handleMenuOpen,
    handleMenuClose,
    updatePostHandler,
    removePostHandler,
  } = props;

  const isMenuOpen = Boolean(anchorEl && selectedPostId);
  const currentPost = selectedPostId ? posts.find((p) => p._id === selectedPostId) : null;

  return (
    <TableContainer className="member-table">
      <Table stickyHeader aria-label="posts table">
        <TableHead>
          <TableRow>
            <TableCell>Post</TableCell>
            <TableCell align="center">Author</TableCell>
            <TableCell align="center">Likes / Saves / Comments</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                <Typography color="textSecondary">No posts found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow hover key={post._id}>
                {/* Post Info */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/community/post/${post._id}`} target="_blank">
                      <Avatar
                        variant="rounded"
                        src={
                          post.postImages?.[0]
                            ? `${REACT_APP_API_URL}/${post.postImages[0]}`
                            : '/img/default-post.png'
                        }
                        sx={{ width: 56, height: 56, borderRadius: '10px', border: '1px solid #e2e8f0' }}
                      />
                    </Link>
                    <Box sx={{ maxWidth: '360px' }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '14.5px',
                          color: '#1e293b',
                          lineHeight: 1.4,
                        }}
                      >
                        {post.postTitle || '—'}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '12.5px',
                          color: '#64748b',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.postContent?.substring(0, 120) || '—'}...
                      </Typography>
                      <Typography sx={{ fontSize: '11px', color: '#94a3b8', mt: 0.5 }}>
                        ID: {post._id.slice(-6)} • {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                    {post.memberData?.memberNick || '—'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1.5} justifyContent="center">
                    <Typography sx={{ fontSize: '13px', color: '#f59e0b' }}>
                      {post.postLikes ?? 0} likes
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                      • {post.postSaves ?? 0} saves
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
                      • {post.postComments ?? 0} comments
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, post._id)}
                    className={`badge ${post.postStatus}`}
                    sx={{ minWidth: 100, textTransform: 'uppercase', fontSize: '12.5px' }}
                  >
                    {post.postStatus}
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
          .filter((s) => s !== currentPost?.postStatus)
          .map((status) => (
            <MenuItem
              key={status}
              onClick={() => {
                if (selectedPostId) {
                  updatePostHandler(selectedPostId, { postStatus: status });
                }
              }}
              sx={{
                color: status === PostStatus.DELETE || status === PostStatus.BLOCKED ? '#ef4444' : undefined,
                fontWeight: status === PostStatus.DELETE || status === PostStatus.BLOCKED ? 600 : 400,
              }}
            >
              {status}
            </MenuItem>
          ))}

        <MenuItem
          onClick={() => selectedPostId && removePostHandler(selectedPostId)}
          sx={{ color: '#ef4444', fontWeight: 600 }}
        >
          Permanently Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};