 import React, { useState } from 'react';
import { Box, Button, Avatar, Chip } from '@mui/material';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Award } from 'lucide-react';
import { Post } from '../../types/post/post';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';

interface PostCardProps {
	post: Post;
	onCommentClick: (post: Post) => void;
	onLikeClick?: (user: any, postId: string) => void;
	onSaveClick?: (postId: string) => void;
	currentUser?: any;
}

const PostCard: React.FC<PostCardProps> = ({ 
	post, 
	onCommentClick,
	onLikeClick,
	onSaveClick,
	currentUser
}) => {
	// Check if current user already liked the post
	const [isLiked, setIsLiked] = useState(
		post?.meLiked && post.meLiked.length > 0 ? post.meLiked[0]?.myFavorite : false
	);
	const [isSaved, setIsSaved] = useState(false);
	const [likeCount, setLikeCount] = useState(post?.postLikes || 0);

	const handleLike = async () => {
		const newLikedState = !isLiked;
		setIsLiked(newLikedState);
		setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
		
		if (onLikeClick) {
			await onLikeClick(currentUser, post._id);
		}
	};

	const handleSave = async () => {
		const newSavedState = !isSaved;
		setIsSaved(newSavedState);
		
		if (onSaveClick) {
			await onSaveClick(post._id);
		}
	};

	// Get author image
	const getAuthorImage = () => {
		if (post?.memberData?.memberImage) {
			return `${REACT_APP_API_URL}/${post.memberData.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	// Get post images
	const getPostImage = () => {
		if (post?.postImage) {
			return (img => `${REACT_APP_API_URL}/${img}`);
		}
		return [];
	};

	// Format timestamp
	const formatTimestamp = (date: Date) => {
		return moment(date).fromNow();
	};

	return (
		<Box className="post-card">
			{/* Post Header */}
			<Box className="post-header">
				<Avatar 
					className="post-avatar" 
					src={getAuthorImage()} 
					alt={post?.memberData?.memberNick || 'User'}
				/>
				<Box className="post-author-info">
					<Box className="author-name">
						<span>{post?.memberData?.memberNick || 'Anonymous'}</span>
						{post?.memberData?.memberType === 'AGENT' && (
							<Award size={16} className="verified-badge" />
						)}
					</Box>
					<Box className="post-meta">
						<span>@{post?.memberData?.memberNick?.toLowerCase().replace(/\s/g, '') || 'user'}</span>
						<span>•</span>
						<span>{formatTimestamp(post?.createdAt)}</span>
					</Box>
				</Box>
				<Button className="post-more-btn">

					<span>Follow </span>
				</Button>
			</Box>

			{/* Post Content */}
			<Box className="post-content">
				<p className="post-title">{post?.postTitle}</p>
				{post?.postContent && <p className="post-description">{post.postContent}</p>}
			</Box>

			{/* Post Stats */}
			<Box className="post-stats">
				<span>
					<Heart size={16} /> {likeCount} likes
				</span>
				<span>
					<MessageCircle size={16} /> {post?.postComments || 0} comments
				</span>
			</Box>

			{/* Post Actions */}
			<Box className="post-actions">
				<Button 
					className={`action-btn ${isLiked ? 'liked' : ''}`}
					onClick={handleLike}
				>
					<Heart 
						size={20} 
						fill={isLiked ? '#ef4444' : 'none'}
						color={isLiked ? '#ef4444' : 'currentColor'}
					/>
					<span style={{ color: isLiked ? '#ef4444' : 'inherit' }}>
						Like
					</span>
				</Button>
				<Button 
					className="action-btn"
					onClick={() => onCommentClick(post)}
				>
					<MessageCircle size={20} />
					Comment
				</Button>
				<Button 
					className={`action-btn ${isSaved ? 'saved' : ''}`}
					onClick={handleSave}
				>
					<Bookmark 
						size={20}
						fill={isSaved ? '#667eea' : 'none'}
						color={isSaved ? '#667eea' : 'currentColor'}
					/>
					<span style={{ color: isSaved ? '#667eea' : 'inherit' }}>
						Save
					</span>
				</Button>
			</Box>
		</Box>
	);
};

export default PostCard;