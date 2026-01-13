// CommentModal.tsx (refactored with classNames)
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Avatar, 
  IconButton, 
  TextField, 
  Stack,
  Typography,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { X, Send, MoreVertical, Edit2, Trash2, Check, XIcon } from 'lucide-react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CREATE_COMMENT, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_COMMENTS } from '../../apollo/user/query';
import { userVar } from '../../apollo/store';
import { Post } from '../../types/post/post';
import { Comment } from '../../types/comment/comment';
import { CommentsInquiry } from '../../types/comment/comment.input';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import { Direction } from '../../enums/common.enum';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onCommentAdded?: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ open, onClose, post, onCommentAdded }) => {
  const user = useReactiveVar(userVar);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const [totalComments, setTotalComments] = useState(post?.postComments || 0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  // Comment inquiry for fetching
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>({
    page: 1,
    limit: 20,
    sort: 'createdAt',
    direction: Direction.DESC,
    search: {
      commentRefId: post?._id || '',
    },
  });

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  const {
    loading: commentsLoading,
    data: commentsData,
    error: commentsError,
    refetch: commentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: commentInquiry,
    },
    skip: !post?._id,
    notifyOnNetworkStatusChange: true,
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (post?._id) {
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: post._id,
        },
      });
      setTotalComments(post.postComments || 0);
    }
  }, [post?._id, post?.postComments]);

  useEffect(() => {
    if (commentsData?.getComments) {
      setComments(commentsData.getComments.list || []);
      const total = commentsData.getComments.metaCounter?.[0]?.total || commentsData.getComments.list?.length || 0;
      setTotalComments(total);
    }
  }, [commentsData]);

  useEffect(() => {
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }
  }, [commentsError]);

  /** HANDLERS **/
  const handleSendComment = async () => {
    try {
      if (!commentText.trim()) return;
      if (!user?._id) {
        console.warn('Please login to comment');
        return;
      }
      if (!post?._id) return;

      // Optimistic update - add comment to UI immediately
      const tempComment: Comment = {
        _id: `temp-${Date.now()}`,
        commentContent: commentText.trim(),
        commentGroup: CommentGroup.POST,
        commentRefId: post._id,
        memberId: user._id,
        memberData: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Comment;

      setComments((prev) => [tempComment, ...prev]);
      setTotalComments((prev) => prev + 1);
      setCommentText('');

      await createComment({
        variables: {
          input: {
            commentGroup: CommentGroup.POST,
            commentContent: commentText.trim(),
            commentRefId: post._id,
          },
        },
      });

      // Refetch to get real data
      await commentsRefetch({ input: commentInquiry });

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err: any) {
      console.error('ERROR, handleSendComment:', err);
      // Rollback on error
      setComments((prev) => prev.filter((c) => !c._id.startsWith('temp-')));
      setTotalComments((prev) => Math.max(0, prev - 1));
      sweetErrorHandling(err).then();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setAnchorEl({ ...anchorEl, [commentId]: event.currentTarget });
  };

  const handleMenuClose = (commentId: string) => {
    setAnchorEl({ ...anchorEl, [commentId]: null });
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentContent);
    handleMenuClose(comment._id);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      if (!editText.trim()) return;

      // Optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, commentContent: editText.trim() } : c
        )
      );
      setEditingCommentId(null);
      setEditText('');

      await updateComment({
        variables: {
          input: {
            _id: commentId,
            commentContent: editText.trim(),
          },
        },
      });

      await commentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert('Comment updated!', 800);
    } catch (err: any) {
      console.error('ERROR, handleUpdateComment:', err);
      // Refetch to revert changes
      await commentsRefetch({ input: commentInquiry });
      sweetErrorHandling(err).then();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setTotalComments((prev) => Math.max(0, prev - 1));
      handleMenuClose(commentId);
      await updateComment({
        variables: {
          input: {
            _id: commentId,
            commentStatus: 'DELETE', 
          },
        },
      });

      await commentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert('Comment deleted!', 800);

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err: any) {
      console.error('ERROR, handleDeleteComment:', err);
      await commentsRefetch({ input: commentInquiry });
      sweetErrorHandling(err).then();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, commentId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdateComment(commentId);
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleImageError = (commentId: string) => {
    setImageError((prev) => ({ ...prev, [commentId]: true }));
  };

  const getAuthorImage = (memberImage?: string, commentId?: string) => {
    if (commentId && imageError[commentId]) {
      return '/img/profile/defaultUser.svg';
    }
    if (memberImage) {
      return `${REACT_APP_API_URL}/${memberImage}`;
    }
    return '/img/profile/defaultUser.svg';
  };

  const getUserImageSrc = () => {
    if (user?.memberImage) {
      return `${REACT_APP_API_URL}/${user.memberImage}`;
    }
    return '/img/profile/defaultUser.svg';
  };

  const formatTimestamp = (date: Date) => {
    return moment(date).fromNow();
  };

  if (!post) return null;

  const getPostImages = () => {
    if (post?.postImages && Array.isArray(post.postImages)) {
      return post.postImages.map((img) => `${REACT_APP_API_URL}/${img}`);
    }
    return [];
  };

  const postImages = getPostImages();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="comment-modal-dialog"
    >
      <DialogContent className="comment-modal-content">
        <Box className="comment-modal-main-box">
          {/* Header */}
          <Box className="comment-modal-header">
            <Box className="comment-modal-header-left">
              <Avatar src={getAuthorImage(post.memberData?.memberImage)} className="comment-modal-author-avatar" />
              <Box className="comment-modal-author-info">
                <Typography className="comment-modal-author-name">
                  {post.memberData?.memberNick || 'Anonymous'}
                </Typography>
                <Typography className="comment-modal-author-time">
                  {formatTimestamp(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} className="comment-modal-close-btn">
              <X size={20} />
            </IconButton>
          </Box>

          {/* Post Content */}
          <Box className="comment-modal-post-content">
            <Typography className="comment-modal-post-title">
              {post.postTitle}
            </Typography>
            {post.postContent && (
              <Typography className="comment-modal-post-text">
                {post.postContent}
              </Typography>
            )}

            {/* Post Images */}
            {postImages.length > 0 && (
              <Box className="comment-modal-post-images-container">
                {postImages.length === 1 ? (
                  <img
                    src={postImages[0]}
                    alt="post"
                    className="comment-modal-single-image"
                  />
                ) : (
                  <Box className="comment-modal-multi-images-grid">
                    {postImages.slice(0, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`post-${index}`}
                        className="comment-modal-multi-image"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Box className="comment-modal-post-stats">
              <span className="comment-modal-likes">{post.postLikes || 0} likes</span>
              <span className="comment-modal-comments">{totalComments} comments</span>
            </Box>
          </Box>

          {/* Comments List */}
          <Box className="comment-modal-comments-list">
            {commentsLoading && comments.length === 0 ? (
              <Box className="comment-modal-loading-box">
                <Typography className="comment-modal-loading-text">Loading comments...</Typography>
              </Box>
            ) : comments && comments.length > 0 ? (
              <Stack spacing={2.5} className="comment-modal-comments-stack">
                {comments.map((comment: Comment) => (
                  <Box key={comment._id} className="comment-item-wrapper">
                    <Box className="comment-item-main">
                      <Avatar
                        src={getAuthorImage(comment.memberData?.memberImage, comment._id)}
                        onError={() => handleImageError(comment._id)}
                        className="comment-item-avatar"
                      />
                      <Box className="comment-item-content">
                        {editingCommentId === comment._id ? (
                          // Edit Mode
                          <Box className="comment-edit-container">
                            <TextField
                              fullWidth
                              multiline
                              maxRows={3}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => handleEditKeyPress(e, comment._id)}
                              autoFocus
                              className="comment-edit-field"
                            />
                            <Box className="comment-edit-buttons">
                              <IconButton
                                size="small"
                                onClick={() => handleUpdateComment(comment._id)}
                                disabled={!editText.trim()}
                                className="comment-edit-confirm-btn"
                              >
                                <Check size={18} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleCancelEdit}
                                className="comment-edit-cancel-btn"
                              >
                                <XIcon size={18} />
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          // View Mode
                          <>
                            <Box className="comment-view-bubble">
                              <Box className="comment-view-header">
                                <Typography className="comment-view-author">
                                  {comment.memberData?.memberNick || 'Anonymous'}
                                </Typography>
                                {user?._id === comment.memberId && (
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, comment._id)}
                                    className="comment-menu-btn"
                                  >
                                    <MoreVertical size={16} />
                                  </IconButton>
                                )}
                              </Box>
                              <Typography className="comment-view-text">
                                {comment.commentContent}
                              </Typography>
                            </Box>
                            <Box className="comment-view-footer">
                              <span className="comment-view-time">{formatTimestamp(comment.createdAt)}</span>
                              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                <span className="comment-view-edited">(edited)</span>
                              )}
                            </Box>

                            {/* Comment Menu */}
                            <Menu
                              anchorEl={anchorEl[comment._id]}
                              open={Boolean(anchorEl[comment._id])}
                              onClose={() => handleMenuClose(comment._id)}
                              className="comment-menu"
                            >
                              <MenuItem
                                onClick={() => handleEditClick(comment)}
                                className="comment-menu-edit"
                              >
                                <Edit2 size={16} />
                                Edit
                              </MenuItem>
                              <Divider className="comment-menu-divider" />
                              <MenuItem
                                onClick={() => handleDeleteComment(comment._id)}
                                className="comment-menu-delete"
                              >
                                <Trash2 size={16} />
                                Delete
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box className="comment-modal-no-comments-box">
                <Typography className="comment-modal-no-comments-text">No comments yet. Be the first to comment!</Typography>
              </Box>
            )}
          </Box>

          {/* Comment Input */}
          <Box className="comment-modal-input-section">
            <Box className="comment-input-main">
              <Avatar src={getUserImageSrc()} className="comment-input-avatar" />
              <Box className="comment-input-container">
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!user?._id}
                  className="comment-input-field"
                />
                <IconButton
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || !user?._id}
                  className="comment-input-send-btn"
                >
                  <Send size={18} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;