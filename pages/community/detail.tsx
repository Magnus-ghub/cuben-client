import React from 'react';
import { Stack, Typography, Avatar, IconButton, Chip } from '@mui/material';
import { useRouter } from 'next/router';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Moment from 'react-moment';
import { useReactiveVar } from '@apollo/client';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { userVar } from '../../libs/apollo/store';

interface OpportunityCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: (e: any, user: any, id: string) => void;
}

const OpportunityCard = ({ boardArticle, likeArticleHandler }: OpportunityCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const goDetailPage = (e: any) => {
		if (e.target.closest('.like-button')) return;

		router.push({
			pathname: '/opportunities/detail',
			query: {
				id: boardArticle?._id,
				articleCategory: boardArticle?.articleCategory,
			},
		});
	};

	const getCategoryStyles = (category: string) => {
		const styles: any = {
			CAREER: {
				bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
				color: '#f59e0b',
				icon: '💼',
				label: 'Career',
			},
			EVENTS: {
				bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
				color: '#ec4899',
				icon: '🎉',
				label: 'Event',
			},
			KNOWLEDGE: {
				bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
				color: '#3b82f6',
				icon: '📰',
				label: 'News',
			},
			HELP: {
				bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
				color: '#8b5cf6',
				icon: '📚',
				label: 'Resource',
			},
		};
		return styles[category] || styles.CAREER;
	};

	const categoryStyle = getCategoryStyles(boardArticle?.articleCategory);
	const isLiked = boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite;

	// Strip HTML tags and get excerpt
	const getExcerpt = (html: string, length: number = 150) => {
		const text = html?.replace(/<[^>]*>/g, '') || '';
		return text.length > length ? text.substring(0, length) + '...' : text;
	};

	return (
		<Stack className="opportunity-card" onClick={goDetailPage}>
			{/* Card Image Banner */}
			<Stack className="card-image-section">
				{boardArticle?.articleImage ? (
					<>
						<img
							src={`${process.env.REACT_APP_API_URL}/${boardArticle?.articleImage}`}
							alt={boardArticle?.articleTitle}
							className="card-image"
						/>
						<Stack className="image-overlay">
							<Stack className="category-badge" sx={{ background: categoryStyle.bg }}>
								<Typography className="badge-icon">{categoryStyle.icon}</Typography>
								<Typography className="badge-text">{categoryStyle.label}</Typography>
							</Stack>
						</Stack>
					</>
				) : (
					<Stack className="card-image-placeholder" sx={{ background: categoryStyle.bg }}>
						<Typography className="placeholder-icon">{categoryStyle.icon}</Typography>
						<Typography className="placeholder-text">{categoryStyle.label}</Typography>
					</Stack>
				)}
			</Stack>

			{/* Card Content Section */}
			<Stack className="card-body">
				{/* Category Badge for no-image cards */}
				{!boardArticle?.articleImage && (
					<Chip
						icon={<span>{categoryStyle.icon}</span>}
						label={categoryStyle.label}
						size="small"
						className="category-chip"
						sx={{
							background: categoryStyle.bg,
							color: '#fff',
							fontWeight: 700,
							fontSize: '11px',
							height: '24px',
							marginBottom: '12px',
						}}
					/>
				)}

				{/* Title */}
				<Typography className="card-title">{boardArticle?.articleTitle}</Typography>

				{/* Description/Excerpt */}
				<Typography className="card-description">
					{getExcerpt(boardArticle?.articleContent, 140)}
				</Typography>

				{/* Meta Information Based on Category */}
				<Stack className="card-meta-info">
					{/* Posted Date - Always shown */}
					<Stack className="meta-item">
						<CalendarTodayIcon className="meta-icon" />
						<Typography className="meta-text">
							<Moment fromNow>{boardArticle?.createdAt}</Moment>
						</Typography>
					</Stack>

					{/* Career specific info */}
					{boardArticle?.articleCategory === 'CAREER' && (
						<>
							<Stack className="meta-item">
								<WorkOutlineIcon className="meta-icon" />
								<Typography className="meta-text">Full-time Position</Typography>
							</Stack>
							<Stack className="meta-item">
								<LocationOnIcon className="meta-icon" />
								<Typography className="meta-text">BUFS Campus</Typography>
							</Stack>
						</>
					)}

					{/* Events specific info */}
					{boardArticle?.articleCategory === 'EVENTS' && (
						<>
							<Stack className="meta-item">
								<EventIcon className="meta-icon" />
								<Typography className="meta-text">Upcoming Event</Typography>
							</Stack>
							<Stack className="meta-item">
								<LocationOnIcon className="meta-icon" />
								<Typography className="meta-text">Main Campus</Typography>
							</Stack>
						</>
					)}

					{/* News specific info */}
					{boardArticle?.articleCategory === 'KNOWLEDGE' && (
						<Stack className="meta-item">
							<TrendingUpIcon className="meta-icon" />
							<Typography className="meta-text">University Update</Typography>
						</Stack>
					)}
				</Stack>

				{/* Author and Stats Section */}
				<Stack className="card-footer-section">
					{/* Author Info */}
					<Stack className="author-container">
						<Avatar
							src={
								boardArticle?.memberData?.memberImage
									? `${process.env.REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
									: '/img/user/default.png'
							}
							className="author-avatar"
							sx={{ width: 36, height: 36 }}
						/>
						<Stack className="author-details">
							<Typography className="author-name">
								{boardArticle?.memberData?.memberNick || 'BUFS Admin'}
							</Typography>
							<Typography className="author-role">University Staff</Typography>
						</Stack>
					</Stack>

					{/* Engagement Stats */}
					<Stack className="engagement-stats">
						<Stack className="stat-item">
							<VisibilityIcon className="stat-icon" />
							<Typography className="stat-value">{boardArticle?.articleViews || 0}</Typography>
						</Stack>
						<Stack
							className={`stat-item like-button ${isLiked ? 'liked' : ''}`}
							onClick={(e) => {
								e.stopPropagation();
								likeArticleHandler(e, user, boardArticle?._id);
							}}
						>
							{isLiked ? (
								<ThumbUpAltIcon className="stat-icon liked" />
							) : (
								<ThumbUpOffAltIcon className="stat-icon" />
							)}
							<Typography className="stat-value">{boardArticle?.articleLikes || 0}</Typography>
						</Stack>
						<Stack className="stat-item">
							<ChatBubbleOutlineIcon className="stat-icon" />
							<Typography className="stat-value">{boardArticle?.articleComments || 0}</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* View Details Button */}
				<Stack className="view-details-button">
					<Typography className="button-text">View Full Details</Typography>
					<ArrowForwardIcon className="button-icon" />
				</Stack>
			</Stack>
		</Stack>
	);
};

export default OpportunityCard;