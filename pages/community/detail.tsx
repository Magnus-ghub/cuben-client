import React from 'react';
import { Stack, Typography, Avatar, Chip, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
			sx={{
				background: '#fff',
				borderRadius: '20px',
				padding: '24px',
				boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
				border: '1px solid #f3f4f6',
				cursor: 'pointer',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				position: 'relative',
				overflow: 'hidden',
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
					borderColor: 'rgba(102, 126, 234, 0.3)',
					'& .read-more-arrow': {
						transform: 'translateX(4px)',
					}
				},
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '4px',
					background: categoryStyle.bg,
				}
			}}
		>
			{/* Card Header */}
			<Stack 
				direction="row" 
				justifyContent="space-between" 
				alignItems="flex-start"
				sx={{ mb: 2.5 }}
			>
				<Stack direction="row" alignItems="center" spacing={1.5}>
					<Avatar
						src={
							boardArticle?.memberData?.memberImage
								? `${process.env.REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
								: '/img/user/default.png'
						}
						sx={{ 
							width: 44, 
							height: 44,
							border: '2px solid #f3f4f6',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
						}}
					/>
					<Stack spacing={0.3}>
						<Typography 
							sx={{
								color: '#1f2937',
								fontSize: '14px',
								fontWeight: 700,
								lineHeight: 1.2
							}}
						>
							{boardArticle?.memberData?.memberNick || 'Anonymous'}
						</Typography>
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<AccessTimeIcon sx={{ fontSize: 13, color: '#9ca3af' }} />
							<Typography 
								sx={{
									color: '#9ca3af',
									fontSize: '12px',
									fontWeight: 500
								}}
							>
								<Moment fromNow>{boardArticle?.createdAt}</Moment>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				
				<Chip
					label={
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<span style={{ fontSize: '14px' }}>{categoryStyle.icon}</span>
							<span>{categoryStyle.label}</span>
						</Stack>
					}
					size="small"
					sx={{
						background: categoryStyle.bg,
						color: '#fff',
						fontWeight: 700,
						fontSize: '11px',
						height: '28px',
						borderRadius: '8px',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
						'& .MuiChip-label': {
							px: 1.5
						}
					}}
				/>
			</Stack>

			{/* Card Content */}
			<Stack sx={{ mb: 2.5, minHeight: '120px' }}>
				<Typography 
					sx={{
						color: '#1f2937',
						fontSize: '18px',
						fontWeight: 800,
						lineHeight: 1.4,
						mb: 1.5,
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{boardArticle?.articleTitle}
				</Typography>
				<Typography 
					sx={{
						color: '#6b7280',
						fontSize: '14px',
						fontWeight: 400,
						lineHeight: 1.7,
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{boardArticle?.articleContent?.replace(/<[^>]*>/g, '').substring(0, 150)}...
				</Typography>
			</Stack>

			{/* Card Footer */}
			<Stack 
				direction="row" 
				justifyContent="space-between" 
				alignItems="center"
				sx={{ 
					pt: 2,
					borderTop: '1px solid #f3f4f6'
				}}
			>
				<Stack direction="row" spacing={2}>
					<Stack 
						direction="row" 
						alignItems="center" 
						spacing={0.5}
						className="like-button"
					>
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								likeArticleHandler(e, user, boardArticle?._id);
							}}
							sx={{ 
								padding: '6px',
								'&:hover': {
									background: 'rgba(102, 126, 234, 0.1)'
								}
							}}
						>
							{isLiked ? (
								<ThumbUpAltIcon sx={{ fontSize: 18, color: '#667eea' }} />
							) : (
								<ThumbUpOffAltIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
							)}
						</IconButton>
						<Typography 
							sx={{
								color: isLiked ? '#667eea' : '#6b7280',
								fontSize: '14px',
								fontWeight: 600
							}}
						>
							{boardArticle?.articleLikes || 0}
						</Typography>
					</Stack>
					
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<VisibilityIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
						<Typography 
							sx={{
								color: '#6b7280',
								fontSize: '14px',
								fontWeight: 600
							}}
						>
							{boardArticle?.articleViews || 0}
						</Typography>
					</Stack>
					
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
						<Typography 
							sx={{
								color: '#6b7280',
								fontSize: '14px',
								fontWeight: 600
							}}
						>
							{boardArticle?.articleComments || 0}
						</Typography>
					</Stack>
				</Stack>
				
				<Stack 
					direction="row" 
					alignItems="center" 
					spacing={0.5}
					sx={{
						color: '#667eea',
						fontSize: '14px',
						fontWeight: 700,
					}}
				>
					<Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
						Read more
					</Typography>
					<ArrowForwardIcon 
						className="read-more-arrow"
						sx={{ 
							fontSize: 16,
							transition: 'transform 0.2s ease'
						}} 
					/>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default OpportunityCard;