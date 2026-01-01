import React, { useState } from 'react';
import { Box, Button, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Heart, MessageCircle, Bookmark, Award } from 'lucide-react';
import { Post } from '../../types/post/post';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface PostCardProps {
	post: Post;
	likePostHandler: any;
	// onCommentClick: (post: Post) => void;
	// onLikeClick?: (user: any, postId: string) => void;
	// onSaveClick?: (postId: string) => void;
	// currentUser?: any;
}

const PostCard = (props: PostCardProps) => {
	const { post, likePostHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	// Get author image
	const getAuthorImage = () => {
		if (post?.memberData?.memberImage) {
			return `${REACT_APP_API_URL}/${post.memberData.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	// Get post images - FIXED VERSION
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

	if (device === 'mobile') {
		return <div>MOBILE POSTCARD</div>;
	} else {
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
				</Box>

				{/* Post Actions */}
				<div className="post-actions">
					<IconButton color={'default'} onClick={() => likePostHandler(user, post?._id)}>
						{post?.meLiked && post?.meLiked[0]?.myFavorite ? (
							<FavoriteBorderIcon style={{ color: 'red' }} />
						) : (
							<FavoriteBorderIcon />
						)}
					</IconButton>
					{/* <Button className="action-btn" onClick={() => onCommentClick(post)}>
						<MessageCircle size={20} />
						Comment
					</Button>
					<Button className={`action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
						<Bookmark size={20} fill={isSaved ? '#667eea' : 'none'} color={isSaved ? '#667eea' : 'currentColor'} />
						<span style={{ color: isSaved ? '#667eea' : 'inherit' }}>Save</span>
					</Button> */}
				</div>
			</Box>
		);
	}
};

export default PostCard;
