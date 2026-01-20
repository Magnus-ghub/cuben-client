import React from 'react';
import { Stack, Box, Button, Chip, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_ARTICLES } from '../../apollo/user/query';
import { Article } from '../../types/article/article';
import { ArticleCategory } from '../../enums/article.enum';

const Events = () => {
	const device = useDeviceDetect();

	const { loading, data, error } = useQuery(GET_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 2, 
				sort: 'createdAt', 
				direction: 'DESC',
				search: { 
					articleCategory: ArticleCategory.EVENTS 
				}, 
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	
	const formatEventDate = (createdAt: string) => {
		return new Date(createdAt).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	};


	const formatEventTime = (time?: string) => {
		return time || '10:00 AM'; 
	};

	const upcomingEvents = data?.getArticles?.list?.map((article: Article) => ({
		id: article._id,
		title: article.articleTitle,
		date: formatEventDate(article.createdAt.toString()), 
		// time: formatEventTime(article.articleEventTime), 
		location: 'Campus', 
		attendees: article.articleViews || 0, 
		image: article.articleImage 
			? `${process.env.REACT_APP_API_URL}/${article.articleImage}` 
			: '/img/default-event.png',
	})) || [];

	if (error) {
		console.error('Error fetching events:', error);
		return (
			<Stack className="events-section">
				<Box className="events-card error-state">
					<p>Unable to load events. Please try again later.</p>
				</Box>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<Stack className="events-section">
				<div>Events Mobile</div>
			</Stack>
		);
	}

	if (loading) {
		return (
			<Stack className="events-section">
				<Box className="events-card">
					<Box className="card-header">
						<Calendar size={20} className="header-icon" />
						<h3>Upcoming Events</h3>
						<Link href="/article?articleCategory=EVENTS" className="view-all-link">
							View All
						</Link>
					</Box>
					<Stack className="events-list">
						{Array.from({ length: 4 }).map((_, i) => (  
							<Skeleton key={i} variant="rectangular" height={200} className="event-skeleton" />
						))}
					</Stack>
				</Box>
			</Stack>
		);
	}

	if (upcomingEvents.length === 0) {
		return (
			<Stack className="events-section">
				<Box className="events-card">
					<Box className="card-header">
						<Calendar size={20} className="header-icon" />
						<h3>Upcoming Events</h3>
					</Box>
					<Box className="empty-state">
						<p>No upcoming events available at the moment.</p>
						<Link href="/article?articleCategory=EVENTS">
							<Button variant="outlined">Browse All Articles</Button>
						</Link>
					</Box>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className="events-section">
			<Box className="events-card">
				<Box className="card-header">
					<Calendar size={20} className="header-icon" />
					<h3>Upcoming Events</h3>
					<Link href="/article?articleCategory=EVENTS" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="events-list">
					{upcomingEvents.map((event) => (
						<Link 
							key={event.id} 
							href={`/article?articleCategory=EVENTS`} 
							style={{ textDecoration: 'none' }}
						>
							<Box className="event-item">
								<Box className="event-image">
									<img 
										src={event.image} 
										alt={event.title} 
										onError={(e) => {
											e.currentTarget.src = '/img/default-event.png';
										}}
									/>
								</Box>
								<Box className="event-details">
									<h4>{event.title}</h4>
									<Box className="event-meta">
										<span>
											<Clock size={14} /> {event.date} • {event.time}
										</span>
										<span>
											<MapPin size={14} /> {event.location}
										</span>
										<span>
											<Users size={14} /> {event.attendees} attending
										</span>
									</Box>
								</Box>
							</Box>
						</Link>
					))}
				</Stack>
			</Box>
		</Stack>
	);
};

export default Events;