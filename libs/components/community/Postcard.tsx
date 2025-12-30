import React, { useState, useEffect } from 'react';
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
	const [isLiked, setIsLiked] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [likeCount, setLikeCount] = useState(post?.postLikes || 0);

	// Update like state when post data changes
	useEffect(() => {
		if (post?.meLiked && Array.isArray(post.meLiked) && post.meLiked.length > 0) {
			setIsLiked(post.meLiked[0]?.myFavorite || false);
		} else {
			setIsLiked(false);
		}
		setLikeCount(post?.postLikes || 0);
	}, [post]);

	const handleLike = async () => {
		if (!currentUser?._id) {
			console.log('Please login to like posts');
			return;
		}

		// Optimistic UI update
		const newLikedState = !isLiked;
		setIsLiked(newLikedState);
		setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
		
		if (onLikeClick) {
			try {
				await onLikeClick(currentUser, post._id);
			} catch (error) {
				// Revert on error
				setIsLiked(!newLikedState);
				setLikeCount(prev => newLikedState ? prev - 1 : prev + 1);
			}
		}
	};

	const handleSave = () => {
		if (!currentUser?._id) {
			console.log('Please login to save posts');
			return;
		}
		
		setIsSaved(!isSaved);
		onSaveClick?.(post._id);
	};

	// Get author image
	const getAuthorImage = () => {
		if (post?.memberData?.memberImage) {
			return `${REACT_APP_API_URL}/${post.memberData.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	// Get post images
	const getPostImages = () => {
		if (post?.postImages && Array.isArray(post.postImages) && post.postImages.length > 0) {
			return post.postImages.map(img => `${REACT_APP_API_URL}/${img}`);
		}
		return [];
	};

	// Format timestamp
	const formatTimestamp = (date: Date | string) => {
		if (!date) return 'Just now';
		return moment(date).fromNow();
	};

	// Get member type badge
	const isVerified = post?.memberData?.memberType === 'AGENT';

	return (
		<Box className="post-card">
			{/* Post Header */}
			<Box className="post-header">
				<Avatar 
					className="post-avatar" 
					src={getAuthorImage()} 
					alt={post?.memberData?.memberNick || 'User'}
					sx={{ width: 40, height: 40 }}
				/>
				<Box className="post-author-info">
					<Box className="author-name">
						<span>{post?.memberData?.memberNick || 'Anonymous'}</span>
						{isVerified && (
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
					<MoreHorizontal size={20} />
				</Button>
			</Box>

			{/* Post Content */}
			<Box className="post-content">
				{post?.postTitle && <h3 className="post-title">{post.postTitle}</h3>}
				{post?.postTitle && <p className="post-description">{post.postTitle}</p>}
				
				{getPostImages().length > 0 && (
					<Box className={`post-images ${getPostImages().length === 1 ? 'single' : 'grid'}`}>
						{getPostImages().map((img, idx) => (
							<Box key={idx} className="post-image-wrapper">
								<img 
									src={img} 
									alt={`Post image ${idx + 1}`}
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = '/img/banner/placeholder.jpg';
									}}
								/>
							</Box>
						))}
					</Box>
				)}
			</Box>

			{/* Post Stats */}
			<Box className="post-stats">
				<span className="stat-item">
					<Heart size={16} /> {likeCount} {likeCount === 1 ? 'like' : 'likes'}
				</span>
				<span className="stat-item">
					<MessageCircle size={16} /> {post?.postComments || 0} {post?.postComments === 1 ? 'comment' : 'comments'}
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
						{isLiked ? 'Liked' : 'Like'}
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
						{isSaved ? 'Saved' : 'Save'}
					</span>
				</Button>
			</Box>
		</Box>
	);
};

export default PostCard;