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
  TablePagination,
} from '@mui/material';
import { MessageSquare } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { AllPostsInquiry } from '../../../libs/types/post/post.input'; 
import { Post } from '../../../libs/types/post/post'; 
import { PostStatus } from '../../../libs/enums/post.enum';
import { PostUpdate } from '../../../libs/types/post/post.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { REMOVE_POST_BY_ADMIN, UPDATE_POST_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { Direction } from '../../../libs/enums/common.enum';
import { GET_ALL_POSTS_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { PostPanelList } from '../../../libs/components/admin/post/PostList';

const AdminPosts: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [postsInquiry, setPostsInquiry] = useState<AllPostsInquiry>({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: Direction.DESC,
    search: {},
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState<number>(0);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  /** Apollo */
  const [updatePostByAdmin] = useMutation(UPDATE_POST_BY_ADMIN);
  const [removePostByAdmin] = useMutation(REMOVE_POST_BY_ADMIN);

  const { loading, data, error, refetch: refetchPosts } = useQuery(GET_ALL_POSTS_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: postsInquiry },
    notifyOnNetworkStatusChange: true,
  });

  // Update state when data arrives
  useEffect(() => {
    if (data?.getAllPostsByAdmin) {
      console.log('Posts data received →', data.getAllPostsByAdmin);
      setPosts(data.getAllPostsByAdmin.list ?? []);
      setPostsTotal(data.getAllPostsByAdmin.metaCounter?.[0]?.total ?? 0);
    }
  }, [data]);

  // Log errors if any
  useEffect(() => {
    if (error) {
      console.error('GraphQL error (posts):', error);
      console.error('GraphQL errors:', error.graphQLErrors);
      console.error('Network error:', error.networkError);
    }
  }, [error]);

  // Refetch when inquiry changes
  useEffect(() => {
    console.log('postsInquiry changed →', postsInquiry);
    refetchPosts({ input: postsInquiry });
  }, [postsInquiry, refetchPosts]);

  // Debug: watch posts state
  useEffect(() => {
    console.log('Current posts state length:', posts.length);
  }, [posts]);

  /** Handlers */
  const handlePageChange = (event: unknown, newPage: number) => {
    setPostsInquiry((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostsInquiry((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleUpdatePost = async (postId: string, update: Partial<PostUpdate>) => {
    try {
      await updatePostByAdmin({
        variables: { input: { _id: postId, ...update } },
      });
      handleCloseMenu();
      await refetchPosts({ input: postsInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleRemovePost = async (postId: string) => {
    const confirmed = await sweetConfirmAlert('Are you sure you want to permanently delete this post?');
    if (!confirmed) return;

    try {
      await removePostByAdmin({ variables: { input: postId } });
      handleCloseMenu();
      await refetchPosts({ input: postsInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleStatusTabChange = (newValue: string) => {
    setFilterStatus(newValue);

    const nextInquiry = { ...postsInquiry, page: 1 };

    if (newValue !== 'ALL') {
      nextInquiry.search = {
        ...nextInquiry.search,
        postStatus: newValue as PostStatus,
      };
    } else {
      const { postStatus, ...rest } = nextInquiry.search ?? {};
      nextInquiry.search = rest;
    }

    setPostsInquiry(nextInquiry);
  };

  return (
    <Box className="admin-users-container">
      <Box className="page-header">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography className="tit">Posts Management</Typography>
            <Typography variant="body2" color="textSecondary">
              Moderate all community posts created by students
            </Typography>
          </Box>
          <MessageSquare size={40} color="#6366f1" opacity={0.2} />
        </Stack>
      </Box>

      <Box className="table-wrap">
        <List className="tab-menu" sx={{ display: 'flex' }}>
          {['ALL', 'ACTIVE', 'BLOCKED', 'DELETE'].map((status) => (
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

        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">Loading posts...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 5, textAlign: 'center', color: 'error.main' }}>
            <Typography>Error loading posts. Please refresh.</Typography>
            <pre style={{ fontSize: '12px', marginTop: '16px' }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </Box>
        ) : (
          <PostPanelList
            posts={posts}
            anchorEl={anchorEl}
            selectedPostId={selectedPostId}
            handleMenuOpen={handleOpenMenu}
            handleMenuClose={handleCloseMenu}
            updatePostHandler={handleUpdatePost}
            removePostHandler={handleRemovePost}
          />
        )}

        <TablePagination
          rowsPerPageOptions={[10, 20, 40, 80]}
          component="div"
          count={postsTotal}
          rowsPerPage={postsInquiry.limit ?? 10}
          page={(postsInquiry.page ?? 1) - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
};

export default withAdminLayout(AdminPosts);