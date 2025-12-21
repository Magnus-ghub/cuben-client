import React from 'react';
import { Stack, Typography, Avatar, Chip, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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

	const goDetailPage = () => {
		router.push({
			pathname: '/opportunities/detail',
			query: { 
				id: boardArticle?._id,
				articleCategory: boardArticle?.articleCategory 
			},
		});
	};

	const getCategoryColor = (category: string) => {
		const colors: any = {
			COMMUNITY: '#667eea',
			MARKET: '#10b981',
			CAREER: '#f59e0b',
			KNOWLEDGE: '#8b5cf6',
			EVENTS: '#ec4899',
			HELP: '#06b6d4',
		};
		return colors[category] || '#667eea';
	};

	const getCategoryIcon = (category: string) => {
		const icons: any = {
			COMMUNITY: '🏘️',
			MARKET: '🛒',
			CAREER: '💼',
			KNOWLEDGE: '📚',
			EVENTS: '🎉',
			HELP: '💡',
		};
		return icons[category] || '📌';
	};

	return (
		<Stack className="opportunity-card" onClick={goDetailPage}>
			<Stack className="card-header">
				<Stack className="author-info">
					<Avatar
						src={
							boardArticle?.memberData?.memberImage
								? `${process.env.REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
								: '/img/user/default.png'
						}
						sx={{ width: 40, height: 40 }}
					/>
					<Stack className="author-details">
						<Typography className="author-name">
							{boardArticle?.memberData?.memberNick || 'Anonymous'}
						</Typography>
						<Typography className="post-date">
							<Moment format="MMM DD, YYYY">
								{boardArticle?.createdAt}
							</Moment>
						</Typography>
					</Stack>
				</Stack>
				<Chip
					label={getCategoryIcon(boardArticle?.articleCategory) + ' ' + boardArticle?.articleCategory}
					size="small"
					sx={{
						background: getCategoryColor(boardArticle?.articleCategory),
						color: '#fff',
						fontWeight: 600,
						fontSize: '11px',
						textTransform: 'capitalize',
					}}
				/>
			</Stack>

			<Stack className="card-content">
				<Typography className="article-title">
					{boardArticle?.articleTitle}
				</Typography>
				<Typography className="article-excerpt">
					{boardArticle?.articleContent?.replace(/<[^>]*>/g, '').substring(0, 120)}...
				</Typography>
			</Stack>

			<Stack className="card-footer">
				<Stack className="stats">
					<Stack className="stat-item">
						<IconButton
							size="small"
							onClick={(e) => likeArticleHandler(e, user, boardArticle?._id)}
							sx={{ padding: '4px' }}
						>
							{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
								<ThumbUpAltIcon sx={{ fontSize: 18, color: '#667eea' }} />
							) : (
								<ThumbUpOffAltIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
							)}
						</IconButton>
						<Typography className="stat-count">{boardArticle?.articleLikes || 0}</Typography>
					</Stack>
					<Stack className="stat-item">
						<VisibilityIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
						<Typography className="stat-count">{boardArticle?.articleViews || 0}</Typography>
					</Stack>
					<Stack className="stat-item">
						<ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
						<Typography className="stat-count">{boardArticle?.articleComments || 0}</Typography>
					</Stack>
				</Stack>
				<Typography className="read-more">Read more →</Typography>
			</Stack>
		</Stack>
	);
};

export default OpportunityCard;