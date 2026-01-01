import React, { useState } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Heart, MessageCircle, Bookmark, Award } from 'lucide-react';
import { Post } from '../../types/post/post';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { T } from '../../types/common';

interface PostCardProps {
	post: Post;
	likePostHandler: (id: string) => void;
	onCommentClick?: (post: Post) => void;
	onSaveClick?: (id: string) => void;
	user?: T;
}

const PostCard = (props: PostCardProps) => {
	const { post, likePostHandler, onCommentClick, onSaveClick, user } = props;
	const router = useRouter();
	const [isLiking, setIsLiking] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Get author image
	const getAuthorImage = () => {
		if (post?.memberData?.memberImage) {
			return `${REACT_APP_API_URL}/${post.memberData.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	// Get post images
	const getPostImages = () => {
		if (post?.postImages && Array.isArray(post.postImages)) {
			return post.postImages.map((img) => `${REACT_APP_API_URL}/${img}`);
		}
		return [];
	};

	// Format timestamp
	const formatTimestamp = (date: Date) => {
		return moment(date).fromNow();
	};

	const postImages = getPostImages();

	const handleLikeClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (isLiking || !user?._id) return;
		setIsLiking(true);
		await likePostHandler(post._id);
		setIsLiking(false);
	};

	const handleCommentClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('Comment clicked for post:', post._id);
		if (onCommentClick && user?._id) {
			onCommentClick(post);
		} else {
			console.warn('Comment disabled: No handler or not logged in');
		}
	};

	const handleSaveClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		console.log('Save clicked for post:', post._id, 'Current saved state:', post.meSaved?.[0]?.mySaves);
		if (isSaving || !user?._id) return;
		setIsSaving(true);
		if (onSaveClick) {
			await onSaveClick(post._id);
		}
		setIsSaving(false);
	};

	return (
		<Box className="post-card">
			{/* Post Header */}
			<Box className="post-header">
				<Avatar className="post-avatar" src={getAuthorImage()} alt={post?.memberData?.memberNick || 'User'} />
				<Box className="post-author-info">
					<Box className="author-name">
						<span>{post?.memberData?.memberNick || 'Anonymous'}</span>
						{post?.memberData?.memberType === 'AGENT' && <Award size={16} className="verified-badge" />}
					</Box>
					<Box className="post-meta">
						<span>@{post?.memberData?.memberNick?.toLowerCase().replace(/\s/g, '') || 'user'}</span>
						<span>•</span>
						<span>{formatTimestamp(post?.createdAt)}</span>
					</Box>
				</Box>
				<Button className="post-more-btn">
					<span>Follow</span>
				</Button>
			</Box>
			{/* Post Content */}
			<Box className="post-content">
				<p className="post-title">{post?.postTitle}</p>
				{post?.postContent && <p className="post-description">{post.postContent}</p>}
			</Box>
			{/* Post Images */}
			{postImages.length > 0 && (
				<Box className="post-images">
					{postImages.length === 1 ? (
						<img src={postImages[0]} alt="post" style={{ width: '100%', borderRadius: '12px' }} />
					) : (
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: postImages.length === 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
								gap: '8px',
							}}
						>
							{postImages.slice(0, 4).map((img, index) => (
								<img
									key={index}
									src={img}
									alt={`post-${index}`}
									style={{
										width: '100%',
										height: '400px',
										objectFit: 'cover',
										borderRadius: '12px',
									}}
								/>
							))}
						</Box>
					)}
				</Box>
			)}
			{/* Post Stats */}
			<Box className="post-stats">
				<span>
					<Heart size={16} /> {post.postLikes} likes
				</span>
				<span>
					<MessageCircle size={16} /> {post?.postComments || 0} comments
				</span>
				<span>
					<Bookmark size={16} /> {post?.postSaves || 0} saves
				</span>
			</Box>
			{/* Post Actions – 3ta button birxil kenglikda, comment icon joyini tuzatildi */}
			<Box className="post-actions" sx={{ display: 'flex', gap: 0, width: '100%' }}>
				{/* Like Button */}
				<Button
					variant="text"
					disabled={isLiking || !user?._id}
					onClick={handleLikeClick}
					sx={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						justifyContent: 'center',
						color: post?.meLiked?.[0]?.myFavorite ? 'red' : 'inherit',
						textTransform: 'none',
						fontWeight: post?.meLiked?.[0]?.myFavorite ? 600 : 400,
						fontSize: '14px',
						py: 1,
						'&:hover': {
							backgroundColor: '#f3f4f6',
							color: post?.meLiked?.[0]?.myFavorite ? 'red' : 'primary.main',
						},
						minWidth: 'auto',
					}}
				>
					{post?.meLiked?.[0]?.myFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
					<Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
						{post?.meLiked?.[0]?.myFavorite ? 'Liked' : 'Like'}
					</Typography>
				</Button>

				{/* Comment Button – Icon o'lchami tuzatildi, joy egallamasin */}
				<Button
					variant="text"
					className="action-btn"
					onClick={handleCommentClick}
					disabled={!user?._id}
					sx={{
						flex: 1, // Birxil kenglik
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						justifyContent: 'center',
						textTransform: 'none',
						fontWeight: 400,
						color: 'inherit',
						fontSize: '14px',
						py: 1,
						'&:hover': {
							backgroundColor: '#f3f4f6',
							color: 'primary.main',
						},
						minWidth: 'auto',
					}}
				>
					<MessageCircle size={18} />
					<Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
						Comment
					</Typography>
				</Button>

				{/* Save Button */}
				<Button
					variant="text"
					disabled={isSaving || !user?._id}
					onClick={handleSaveClick}
					sx={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						justifyContent: 'center',
						color: post?.meSaved?.[0]?.mySaves ? '#667eea' : '#6b7280', // Default grey
						textTransform: 'none',
						fontWeight: post?.meSaved?.[0]?.mySaves ? 600 : 400,
						fontSize: '14px',
						py: 1,
						'&:hover': {
							backgroundColor: '#f3f4f6',
							color: post?.meSaved?.[0]?.mySaves ? '#667eea' : '#374151', // Active: ko'k, inactive: dark grey (qizil emas)
						},
						minWidth: 'auto',
					}}
				>
					<Bookmark
						size={18}
						fill={post?.meSaved?.[0]?.mySaves ? '#667eea' : 'none'}
						color={post?.meSaved?.[0]?.mySaves ? '#667eea' : 'currentColor'}
					/>
					<Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
						{post?.meSaved?.[0]?.mySaves ? 'Saved' : 'Save'}
					</Typography>
				</Button>
			</Box>
		</Box>
	);
};

export default PostCard;
