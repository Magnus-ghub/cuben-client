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
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { FollowInquiry } from '../../types/follow/follow.input';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface PostCardProps {
	post: Post;
	initialInput: FollowInquiry;
	likePostHandler: any;
	savePostHandler: any;
	subscribeHandler: any;
	unsubscribeHandler: any;
	onCommentClick: (post: Post) => void;
}

const PostCard = (props: PostCardProps) => {
	const { initialInput, post, likePostHandler, savePostHandler, onCommentClick, unsubscribeHandler, subscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [isFollowing, setIsFollowing] = useState<boolean>(false);
	const { t, i18n } = useTranslation('common');

	/** LIFECYCLES **/
	useEffect(() => {
		if (post?.memberData?.meFollowed && post.memberData.meFollowed.length > 0) {
			setIsFollowing(post.memberData.meFollowed[0]?.myFollowing || false);
		} else {
			setIsFollowing(false);
		}
	}, [post?.memberData?.meFollowed]);

	/** HANDLERS **/
	const handleFollowClick = async () => {
		if (!user?._id || !post?.memberData?._id) return;

		try {
			if (isFollowing) {
				await unsubscribeHandler(post.memberData._id);
			} else {
				await subscribeHandler(post.memberData._id);
			}
			setIsFollowing(!isFollowing);
		} catch (error) {
			console.error('Error handling follow:', error);
			setIsFollowing(isFollowing);
		}
	};

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

	// Render HTML content safely
	const renderPostContent = (content: string) => {
		if (!content) return null;

		// Simple sanitization - only allow safe tags
		const cleanContent = content
			.replace(/<script[^>]*>.*?<\/script>/gi, '')
			.replace(/<style[^>]*>.*?<\/style>/gi, '')
			.replace(/on\w+="[^"]*"/gi, '')
			.replace(/on\w+='[^']*'/gi, '');

		return (
			<Box
				className="post-description"
				sx={{
					'& p': {
						margin: '0 0 0.8em',
						lineHeight: 1.6,
						'&:last-child': { marginBottom: 0 }
					},
					'& a': {
						color: '#1877f2',
						textDecoration: 'none',
						'&:hover': { textDecoration: 'underline' }
					},
					'& strong': { fontWeight: 700 },
					'& em': { fontStyle: 'italic' },
				}}
				dangerouslySetInnerHTML={{ __html: cleanContent }}
			/>
		);
	};

	const postImages = getPostImages();
	const isLiked = post.meLiked?.liked || false;
	const isSaved = post.meLiked?.saved || false;
	const isOwnPost = user?._id === post?.memberData?._id;

	return (
		<Box className="post-card">
			{/* Post Header */}
			<Box className="post-header">
				<Avatar className="post-avatar" src={getAuthorImage()} alt={post?.memberData?.memberNick || 'User'} />
				<Link href={`/member?memberId=${post.memberData._id}`} className="post-author-info">
					<Box className="author-name">
						<span>{post?.memberData?.memberNick || 'Anonymous'}</span>
						{post?.memberData?.memberType === 'AGENT' && <Award size={16} className="verified-badge" />}
					</Box>
					<Box className="post-meta">
						<span>@{post?.memberData?.memberNick?.toLowerCase().replace(/\s/g, '') || 'user'}</span>
						<span>•</span>
						<span>{formatTimestamp(post?.createdAt)}</span>
					</Box>
				</Link>

				{!isOwnPost && (
					<Button
						className={`follow-btn ${isFollowing ? 'following' : ''}`}
						onClick={handleFollowClick}
						disabled={!user?._id}
						startIcon={isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
					>
						<span>{isFollowing ? 'Following' : 'Follow'}</span>
					</Button>
				)}
			</Box>

			{/* Post Content */}
			<Box className="post-content">
				<p className="post-title">{post?.postTitle}</p>
				{post?.postContent && renderPostContent(post.postContent)}
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

PostCard.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {
			followingId: undefined,
		},
	},
};

export default PostCard;