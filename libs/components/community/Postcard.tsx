import React, { useState } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IconButton from '@mui/material/IconButton';
import { Heart, MessageCircle, Award } from 'lucide-react';
import { Post } from '../../types/post/post';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

interface PostCardProps {
	post: Post;
	likePostHandler: any;
	savePostHandler: any;
	onCommentClick: (post: Post) => void; // ✅ Comment handler qo'shildi
}

const PostCard = (props: PostCardProps) => {
	const { post, likePostHandler, savePostHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const getAuthorImage = () => {
		if (post?.memberData?.memberImage) {
			return `${REACT_APP_API_URL}/${post.memberData.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	const getPostImages = () => {
		if (post?.postImages && Array.isArray(post.postImages)) {
			return post.postImages.map((img) => `${REACT_APP_API_URL}/${img}`);
		}
		return [];
	};

	const formatTimestamp = (date: Date) => {
		return moment(date).fromNow();
	};

	const postImages = getPostImages();

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
					<Heart size={16} /> {post?.postLikes} likes
				</span>
				<span>
					<MessageCircle size={16} /> {post?.postComments || 0} comments
				</span>
			</Box>

			{/* Post Actions */}
			<Box className="post-actions">
				{/* Like Button */}
				<IconButton 
					color={'default'} 
					onClick={() => likePostHandler(user, post._id)} 
					className='action-btn'
					disabled={!user?._id}
				>
					{post?.meLiked && post?.meLiked[0]?.myFavorite ? (
						<FavoriteIcon style={{ color: 'red' }} />
					) : (
						<FavoriteBorderIcon />
					)}
					<Typography variant="body2" component="span" className="button-text">
						{post?.meLiked?.[0]?.myFavorite ? 'Liked' : 'Like'}
					</Typography>
				</IconButton>

				{/* Comment Button */}
				<Button 
					variant="text" 
					className="action-btn" 
					onClick={() => {
						console.log('Comment button clicked');
					}}
				>
					<MessageCircle size={18} />
					<Typography variant="body2" component="span" className="button-text">
						Comment
					</Typography>
				</Button>

				{/* Save Button */}
				<IconButton 
					color={'default'} 
					onClick={() => savePostHandler(user, post._id)} 
					className='action-btn'
					disabled={!user?._id}
				>
					{post?.meSaved && post?.meSaved[0]?.mySaves ? (
						<BookmarkIcon style={{ color: '#1976d2' }} />
					) : (
						<BookmarkBorderIcon />
					)}
					<Typography variant="body2" component="span" className="button-text">
						{post?.meSaved?.[0]?.mySaves ? 'Saved' : 'Save'}
					</Typography>
				</IconButton>
			</Box>
		</Box>
	);
};

export default PostCard;