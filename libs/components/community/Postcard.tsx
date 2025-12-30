import React, { useState } from 'react';
import { Box, Button, Avatar, Chip } from '@mui/material';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Award } from 'lucide-react';

interface PostAuthor {
	name: string;
	username: string;
	avatar: string;
	verified: boolean;
}

interface Post {
	id: number;
	author: PostAuthor;
	content: string;
	timestamp: string;
	likes: number;
	comments: number;
	images: string[];
	category: string;
}

interface PostCardProps {
	post: Post;
	onCommentClick: (post: Post) => void;
	onLikeClick?: (postId: number) => void;
	onSaveClick?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
	post, 
	onCommentClick,
	onLikeClick,
	onSaveClick 
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const handleLike = () => {
		setIsLiked(!isLiked);
		onLikeClick?.(post.id);
	};

	const handleSave = () => {
		setIsSaved(!isSaved);
		onSaveClick?.(post.id);
	};

	return (
		<Box className="post-card">
			{/* Post Header */}
			<Box className="post-header">
				<Avatar className="post-avatar" src={post.author.avatar} alt={post.author.name} />
				<Box className="post-author-info">
					<Box className="author-name">
						<span>{post.author.name}</span>
						{post.author.verified && <Award size={16} className="verified-badge" />}
					</Box>
					<Box className="post-meta">
						<span>{post.author.username}</span>
						<span>•</span>
						<span>{post.timestamp}</span>
					</Box>
				</Box>
				<Chip label={post.category} size="small" className="post-category" />
				<Button className="post-more-btn">
					<MoreHorizontal size={20} />
				</Button>
			</Box>

			{/* Post Content */}
			<Box className="post-content">
				<p>{post.content}</p>
				{post.images.length > 0 && (
					<Box className="post-images">
						{post.images.map((img, idx) => (
							<img key={idx} src={img} alt={`Post image ${idx + 1}`} />
						))}
					</Box>
				)}
			</Box>

			{/* Post Stats */}
			<Box className="post-stats">
				<span>
					<Heart size={16} /> {post.likes + (isLiked ? 1 : 0)} likes
				</span>
				<span>
					<MessageCircle size={16} /> {post.comments} comments
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