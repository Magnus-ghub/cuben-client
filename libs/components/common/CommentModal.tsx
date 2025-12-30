import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { X, Send, Heart, MoreHorizontal, Smile } from 'lucide-react';

const CommentModal = ({ open, onClose, post }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: 'John Smith',
        avatar: '/img/profile/user1.jpg',
        username: '@johnsmith'
      },
      content: 'Congratulations! I also just finished mine. What a relief! 🎉',
      timestamp: '1 hour ago',
      likes: 12
    },
    {
      id: 2,
      author: {
        name: 'Alice Brown',
        avatar: '/img/profile/user2.jpg',
        username: '@aliceb'
      },
      content: 'Good luck on your break! You deserve it after all that hard work 💪',
      timestamp: '45 minutes ago',
      likes: 8
    },
    {
      id: 3,
      author: {
        name: 'Michael Lee',
        avatar: '/img/profile/user3.jpg',
        username: '@mikelee'
      },
      content: 'Planning to travel during the break. How about you?',
      timestamp: '30 minutes ago',
      likes: 5
    }
  ]);

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: {
          name: 'Mark',
          avatar: '/img/profile/defaultUser.svg',
          username: '@mark'
        },
        content: commentText,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  if (!post) return null;

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
              <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                  {post.author.name}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                  {post.timestamp}
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
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <Typography sx={{ fontSize: '14px', color: '#1f2937', mb: 1.5, lineHeight: 1.6 }}>
              {post.content}
            </Typography>
            {post.images && post.images.length > 0 && (
              <Box sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                mt: 2
              }}>
                <img 
                  src={post.images[0]} 
                  alt="post" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '150px',
                    objectFit: 'cover'
                  }} 
                />
              </Box>
            )}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
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
            <Stack spacing={2.5}>
              {comments.map((comment) => (
                <Box key={comment.id}>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar 
                      src={comment.author.avatar} 
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
                          {comment.author.name}
                        </Typography>
                        <Typography sx={{ 
                          fontSize: '14px', 
                          color: '#374151',
                          lineHeight: 1.5
                        }}>
                          {comment.content}
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
                        <Button 
                          size="small" 
                          sx={{ 
                            minWidth: 'auto',
                            p: 0,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#6b7280',
                            '&:hover': {
                              background: 'transparent',
                              color: '#667eea'
                            }
                          }}
                        >
                          Like
                        </Button>
                        <Button 
                          size="small"
                          sx={{ 
                            minWidth: 'auto',
                            p: 0,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#6b7280',
                            '&:hover': {
                              background: 'transparent',
                              color: '#667eea'
                            }
                          }}
                        >
                          Reply
                        </Button>
                        <span>{comment.timestamp}</span>
                        {comment.likes > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5 
                          }}>
                            <Heart size={12} fill="#ef4444" color="#ef4444" />
                            <span>{comment.likes}</span>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Comment Input */}
          <Box sx={{ 
            p: 2,
            borderTop: '1px solid #e5e7eb',
            background: '#fff'
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              <Avatar 
                src="/img/profile/defaultUser.svg" 
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
                  disabled={!commentText.trim()}
                  sx={{
                    background: commentText.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
                    color: '#fff',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      background: commentText.trim() ? 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)' : '#e5e7eb',
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