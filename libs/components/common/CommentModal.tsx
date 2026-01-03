import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Avatar, 
  IconButton, 
  TextField, 
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { X, Send } from 'lucide-react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CREATE_COMMENT } from '../../apollo/user/mutation';
import { GET_COMMENTS } from '../../apollo/user/query';
import { userVar } from '../../apollo/store';
import { Post } from '../../types/post/post';
import { Comment } from '../../types/comment/comment';
import { CommentsInquiry } from '../../types/comment/comment.input';
import { CommentGroup } from '../../enums/comment.enum';
import { REACT_APP_API_URL, Messages } from '../../config';
import moment from 'moment';
import { Direction } from '../../enums/common.enum';

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
      // Update total comments from server
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

    console.log('Sending comment...', {
      commentGroup: CommentGroup.POST,
      commentContent: commentText.trim(),
      commentRefId: post._id,
    });

    await createComment({
      variables: {
        input: {
          commentGroup: CommentGroup.POST,
          commentContent: commentText.trim(),
          commentRefId: post._id,
        },
      },
    });

    // ✅ Comment yaratilgandan so'ng commentlarni refetch qilish
    await commentsRefetch({ input: commentInquiry });
    
    console.log('Comment created successfully');

    setCommentText('');
    setTotalComments(prev => prev + 1);
    
    // ✅ Parent componentga xabar berish (posts listini yangilash uchun)
    if (onCommentAdded) {
      onCommentAdded();
    }
  } catch (err: any) {
    console.error('ERROR, handleSendComment:', err);
    console.error('Error details:', err.message);
    console.warn('Failed to send comment. Please try again.');
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleImageError = (commentId: string) => {
    setImageError(prev => ({ ...prev, [commentId]: true }));
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

  // Get post images
  const getPostImages = () => {
    if (post?.postImages && Array.isArray(post.postImages)) {
      return post.postImages.map(img => `${REACT_APP_API_URL}/${img}`);
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
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '90vh',
          m: 2
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                src={getAuthorImage(post.memberData?.memberImage)} 
                sx={{ width: 40, height: 40 }} 
              />
              <Box>
                <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                  {post.memberData?.memberNick || 'Anonymous'}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                  {formatTimestamp(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} sx={{ color: '#6b7280' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {/* Post Content */}
          <Box sx={{ 
            p: 2.5, 
            borderBottom: '1px solid #e5e7eb',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', mb: 1 }}>
              {post.postTitle}
            </Typography>
            {post.postContent && (
              <Typography sx={{ fontSize: '14px', color: '#1f2937', mb: 1.5, lineHeight: 1.6 }}>
                {post.postContent}
              </Typography>
            )}
            
            {/* Post Images */}
            {postImages.length > 0 && (
              <Box sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                mt: 2
              }}>
                {postImages.length === 1 ? (
                  <img 
                    src={postImages[0]} 
                    alt="post" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px' 
                  }}>
                    {postImages.slice(0, 4).map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`post-${index}`} 
                        style={{ 
                          width: '100%', 
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px' 
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <span>{post.postLikes || 0} likes</span>
              <span>{totalComments} comments</span>
            </Box>
          </Box>

          {/* Comments List */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#d1d5db',
              borderRadius: '3px'
            }
          }}>
            {commentsLoading ? (
              <Box sx={{ textAlign: 'center', py: 4, color: '#6b7280' }}>
                <Typography>Loading comments...</Typography>
              </Box>
            ) : comments && comments.length > 0 ? (
              <Stack spacing={2.5}>
                {comments.map((comment: Comment) => (
                  <Box key={comment._id}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Avatar 
                        src={getAuthorImage(comment.memberData?.memberImage, comment._id)} 
                        onError={() => handleImageError(comment._id)}
                        sx={{ width: 36, height: 36, flexShrink: 0 }} 
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ 
                          background: '#f3f4f6',
                          borderRadius: '16px',
                          p: 1.5
                        }}>
                          <Typography sx={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#1f2937',
                            mb: 0.5
                          }}>
                            {comment.memberData?.memberNick || 'Anonymous'}
                          </Typography>
                          <Typography sx={{ 
                            fontSize: '14px', 
                            color: '#374151',
                            lineHeight: 1.5
                          }}>
                            {comment.commentContent}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 2, 
                          mt: 0.5,
                          ml: 1.5,
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          <span>{formatTimestamp(comment.createdAt)}</span>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: '#6b7280' }}>
                <Typography>No comments yet. Be the first to comment!</Typography>
              </Box>
            )}
          </Box>

          {/* Comment Input */}
          <Box sx={{ 
            p: 2,
            borderTop: '1px solid #e5e7eb',
            background: '#fff'
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Avatar 
                src={getUserImageSrc()} 
                sx={{ width: 36, height: 36, flexShrink: 0 }} 
              />
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                gap: 1,
                alignItems: 'flex-end'
              }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!user?._id}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      background: '#f3f4f6',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                        borderColor: '#e5e7eb'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: '2px'
                      }
                    }
                  }}
                />
                <IconButton
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || !user?._id}
                  sx={{
                    background: commentText.trim() && user?._id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
                    color: '#fff',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      background: commentText.trim() && user?._id ? 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)' : '#e5e7eb',
                    },
                    '&.Mui-disabled': {
                      background: '#e5e7eb',
                      color: '#9ca3af'
                    }
                  }}
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