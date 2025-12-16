import React from 'react';
import { Stack, Box, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Calendar, Star, TrendingUp, AlertCircle } from 'lucide-react';

const Notice = () => {
	const device = useDeviceDetect();

	const announcements = [
		{
			id: 1,
			type: 'event',
			title: 'Winter Break Community Event - Free Pizza Party! 🎉',
			description: 'Join us for a community gathering on Dec 20th at the main cafeteria',
			date: 'Dec 15, 2024',
			icon: '🎉',
			priority: 'high',
		},
		{
			id: 2,
			type: 'update',
			title: 'New Feature: Enhanced Job Board Search Filters',
			description: 'Now you can filter jobs by salary range, location, and company size',
			date: 'Dec 12, 2024',
			icon: '✨',
			priority: 'medium',
		},
		{
			id: 3,
			type: 'announcement',
			title: 'Marketplace Safety Guidelines Updated',
			description: 'Please review our updated safety guidelines for buying and selling items',
			date: 'Dec 10, 2024',
			icon: '🛡️',
			priority: 'medium',
		},
		{
			id: 4,
			type: 'event',
			title: 'Tech Career Fair 2025 - Registration Open',
			description: 'Meet top companies and find your dream internship. Register now!',
			date: 'Dec 8, 2024',
			icon: '💼',
			priority: 'high',
		},
		{
			id: 5,
			type: 'maintenance',
			title: 'Scheduled Maintenance - Jan 5, 2025',
			description: 'Platform will be unavailable from 2:00 AM to 4:00 AM KST for updates',
			date: 'Dec 5, 2024',
			icon: '🔧',
			priority: 'low',
		},
		{
			id: 6,
			type: 'announcement',
			title: 'Welcome to Cuben Community! 🎓',
			description:
				'Thank you for joining our platform. Check out our getting started guide to make the most of Cuben',
			date: 'Dec 1, 2024',
			icon: '👋',
			priority: 'low',
		},
	];

	const getPriorityClass = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'priority-high';
			case 'medium':
				return 'priority-medium';
			default:
				return 'priority-low';
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'event':
				return <Star size={16} />;
			case 'update':
				return <TrendingUp size={16} />;
			case 'maintenance':
				return <AlertCircle size={16} />;
			default:
				return <Calendar size={16} />;
		}
	};

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	}

	return (
		<Stack className={'notice-content'}>
			<Box className={'section-header'}>
				<h2>Latest Announcements</h2>
				<p>Stay updated with the latest news and updates from Cuben</p>
			</Box>

			<Stack className={'announcements-list'}>
				{announcements.map((announcement) => (
					<Box key={announcement.id} className={`announcement-card ${getPriorityClass(announcement.priority)}`}>
						<Box className={'announcement-header'}>
							<Box className={'left-side'}>
								<Box className={'announcement-icon'}>{announcement.icon}</Box>
								<Box className={'announcement-info'}>
									<Box className={'title-row'}>
										<h3>{announcement.title}</h3>
										<Chip
											icon={getTypeIcon(announcement.type)}
											label={announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
											size="small"
											className={`type-badge ${announcement.type}`}
										/>
									</Box>
									<p className={'description'}>{announcement.description}</p>
								</Box>
							</Box>
							<Box className={'right-side'}>
								<Box className={'date-badge'}>
									<Calendar size={16} />
									<span>{announcement.date}</span>
								</Box>
							</Box>
						</Box>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

export default Notice;