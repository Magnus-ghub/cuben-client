import React from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Events = () => {
	const device = useDeviceDetect();

	const upcomingEvents = [
		{
			id: 1,
			title: 'Tech Career Fair 2025',
			date: 'Jan 25, 2025',
			time: '10:00 AM',
			location: 'Main Hall',
			attendees: 234,
			image: '/img/banner/techcareer.webp',
		},
		{
			id: 2,
			title: 'Winter Festival',
			date: 'Jan 28, 2025',
			time: '2:00 PM',
			location: 'Campus Garden',
			attendees: 456,
			image: '/img/banner/winterfes.jpg',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className="events-section">
				<div>Events Mobile</div>
			</Stack>
		);
	}

	return (
		<Stack className="events-section">
			<Box className="events-card">
				<Box className="card-header">
					<Calendar size={20} className="header-icon" />
					<h3>Upcoming Events</h3>
					<Link href="/community" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="events-list">
					{upcomingEvents.map((event) => (
						<Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
							<Box className="event-item">
								<Box className="event-image">
									<img src={event.image} alt={event.title} />
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