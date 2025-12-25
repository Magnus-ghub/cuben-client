// OpportunityCard.tsx
import React from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
				articleCategory: boardArticle?.articleCategory 
			},
		});
	};

	const getCategoryStyles = (category: string) => {
		const styles: any = {
			COMMUNITY: {
				bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				icon: '👥',
				label: 'Community'
			},
			MARKET: {
				bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
				icon: '🛒',
				label: 'Marketplace'
			},
			CAREER: {
				bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
				icon: '💼',
				label: 'Career'
			},
			KNOWLEDGE: {
				bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
				icon: '📚',
				label: 'Knowledge'
			},
			EVENTS: {
				bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
				icon: '🎉',
				label: 'Events'
			},
			HELP: {
				bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
				icon: '💡',
				label: 'Help'
			},
		};
		return styles[category] || styles.COMMUNITY;
	};

	const categoryStyle = getCategoryStyles(boardArticle?.articleCategory);
	const isLiked = boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite;

	return (
		<Stack 
			className="opportunity-card"
			onClick={goDetailPage}
		>
			{/* Featured Image/Banner */}
			{boardArticle?.articleImage && (
				<Stack className="card-banner">
					<img 
						src={`${process.env.REACT_APP_API_URL}/${boardArticle?.articleImage}`}
						alt={boardArticle?.articleTitle}
					/>
					<Stack className="banner-overlay">
						<Stack 
							className="category-badge"
							sx={{ background: categoryStyle.bg }}
						>
							<Typography className="category-icon">{categoryStyle.icon}</Typography>
							<Typography className="category-text">{categoryStyle.label}</Typography>
						</Stack>
					</Stack>
				</Stack>
			)}

			{/* Card Content */}
			<Stack className="card-content">
				{/* Category Badge (if no image) */}
				{!boardArticle?.articleImage && (
					<Stack 
						className="category-badge-top"
						sx={{ background: categoryStyle.bg }}
					>
						<Typography className="category-icon">{categoryStyle.icon}</Typography>
						<Typography className="category-text">{categoryStyle.label}</Typography>
					</Stack>
				)}

				{/* Title */}
				<Typography className="card-title">
					{boardArticle?.articleTitle}
				</Typography>

				{/* Excerpt */}
				<Typography className="card-excerpt">
					{boardArticle?.articleContent?.replace(/<[^>]*>/g, '').substring(0, 120)}...
				</Typography>

				{/* Meta Info */}
				<Stack className="card-meta">
					<Stack className="meta-item">
						<CalendarTodayIcon />
						<Typography>
							<Moment fromNow>{boardArticle?.createdAt}</Moment>
						</Typography>
					</Stack>
					{boardArticle?.articleCategory === 'EVENTS' && (
						<Stack className="meta-item">
							<LocationOnIcon />
							<Typography>Campus Center</Typography>
						</Stack>
					)}
					{boardArticle?.articleCategory === 'CAREER' && (
						<Stack className="meta-item">
							<WorkOutlineIcon />
							<Typography>Full-time</Typography>
						</Stack>
					)}
				</Stack>

				{/* Author & Stats */}
				<Stack className="card-footer">
					<Stack className="author-section">
						<Avatar
							src={
								boardArticle?.memberData?.memberImage
									? `${process.env.REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
									: '/img/user/default.png'
							}
							className="author-avatar"
						/>
						<Stack className="author-info">
							<Typography className="author-name">
								{boardArticle?.memberData?.memberNick || 'Anonymous'}
							</Typography>
							<Typography className="author-role">University Admin</Typography>
						</Stack>
					</Stack>

					<Stack className="stats-section">
						<Stack className="stat-item">
							<VisibilityIcon />
							<Typography>{boardArticle?.articleViews || 0}</Typography>
						</Stack>
						<Stack 
							className={`stat-item like-button ${isLiked ? 'liked' : ''}`}
							onClick={(e) => {
								e.stopPropagation();
								likeArticleHandler(e, user, boardArticle?._id);
							}}
						>
							{isLiked ? (
								<ThumbUpAltIcon />
							) : (
								<ThumbUpOffAltIcon />
							)}
							<Typography>{boardArticle?.articleLikes || 0}</Typography>
						</Stack>
						<Stack className="stat-item">
							<ChatBubbleOutlineIcon />
							<Typography>{boardArticle?.articleComments || 0}</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* Read More Button */}
				<Stack className="read-more">
					<Typography>Read More</Typography>
					<ArrowForwardIcon className="arrow-icon" />
				</Stack>
			</Stack>
		</Stack>
	);
};

export default OpportunityCard;