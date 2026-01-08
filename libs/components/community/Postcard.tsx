import React, { useState, useEffect } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IconButton from '@mui/material/IconButton';
import { Heart, MessageCircle, Award, UserPlus, UserCheck } from 'lucide-react';
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
	onCommentClick: (post: Post) => void;
	followHandler?: (memberId: string) => Promise<void>;
}

const PostCard = (props: PostCardProps) => {
	const { post, likePostHandler, savePostHandler, onCommentClick, followHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Properly check if following - check array exists, has length, and myFollowing is true
	const getFollowStatus = () => {
		const meFollowed = post?.memberData?.meFollowed;
		return (
			meFollowed &&
			Array.isArray(meFollowed) &&
			meFollowed.length > 0 &&
			meFollowed[0]?.myFollowing === true
		);
	};

	// Local state for optimistic follow update
	const [isFollowing, setIsFollowing] = useState<boolean>(getFollowStatus());
	const [isFollowLoading, setIsFollowLoading] = useState(false);

	// Update local state when post data changes
	useEffect(() => {
		setIsFollowing(getFollowStatus());
	}, [post?.memberData?.meFollowed]);

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

	const handleFollowClick = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event bubbling

		if (!user?._id) {
			// User not logged in
			router.push('/account/join');
			return;
		}

		if (!post?.memberData?._id) return;

		// Don't allow following yourself
		if (user._id === post.memberData._id) return;

		if (!followHandler) return;

		setIsFollowLoading(true);

		// Optimistic update
		const previousState = isFollowing;
		setIsFollowing(!isFollowing);

		try {
			await followHandler(post.memberData._id);
		} catch (err) {
			// Rollback on error
			setIsFollowing(previousState);
			console.error('Follow error:', err);
		} finally {
			setIsFollowLoading(false);
		}
	};

	const postImages = getPostImages();
	const isLiked = post.meLiked?.liked || false;
	const isSaved = post.meLiked?.saved || false;
	const isOwnPost = user?._id === post?.memberData?._id;

	console.log('PostCard Follow Status:', {
		postId: post._id,
		authorId: post?.memberData?._id,
		meFollowed: post?.memberData?.meFollowed,
		isFollowing,
		isOwnPost,
	});

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

				{/* Follow/Unfollow Button - Only show if not own post */}
				{!isOwnPost && (
					<Button
						className={`follow-btn ${isFollowing ? 'following' : ''}`}
						onClick={handleFollowClick}
						disabled={isFollowLoading || !user?._id}
						startIcon={isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
					>
						<span>{isFollowing ? 'Following' : 'Follow'}</span>
					</Button>
				)}
			</Box>

			{/* Post Content */}
			<Box className="post-content">
				<p className="post-title">{post?.postTitle}</p>
				{post?.postContent && <p className="post-description">{post.postContent}</p>}
			</Box>

			{/* Post Images */}
			{postImages.length > 0 && (
				<Box className={`post-images post-images-${postImages.length}`}>
					{postImages.length === 1 ? (
						<img src={postImages[0]} alt="post" className="single-image" />
					) : postImages.length === 2 ? (
						<Box className="images-grid-2">
							{postImages.slice(0, 2).map((img, index) => (
								<img key={index} src={img} alt={`post-${index}`} className="multi-image" />
							))}
						</Box>
					) : postImages.length === 3 ? (
						<Box className="images-grid-3">
							{postImages.slice(0, 3).map((img, index) => (
								<img key={index} src={img} alt={`post-${index}`} className="multi-image" />
							))}
						</Box>
					) : (
						<Box className="images-grid-4">
							{postImages.slice(0, 4).map((img, index) => (
								<img key={index} src={img} alt={`post-${index}`} className="multi-image" />
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
					className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
					disabled={!user?._id}
				>
					{isLiked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
					<Typography variant="body2" component="span" className="button-text">
						{isLiked ? 'Liked' : 'Like'}
					</Typography>
				</IconButton>

				{/* Comment Button */}
				<Button variant="text" className="action-btn comment-btn" onClick={() => onCommentClick(post)}>
					<MessageCircle size={18} />
					<Typography variant="body2" component="span" className="button-text">
						Comment
					</Typography>
				</Button>

				{/* Save Button */}
				<IconButton
					color={'default'}
					onClick={() => savePostHandler(user, post._id)}
					className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
					disabled={!user?._id}
				>
					{isSaved ? <BookmarkIcon style={{ color: '#1976d2' }} /> : <BookmarkBorderIcon />}
					<Typography variant="body2" component="span" className="button-text">
						{isSaved ? 'Saved' : 'Save'}
					</Typography>
				</IconButton>
			</Box>
		</Box>
	);
};

export default PostCard;