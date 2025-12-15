import React  from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Image as ImageIcon,
	Zap,
} from 'lucide-react';

const HeroSection = () => {
	const device = useDeviceDetect();
	

	/** APOLLO REQUESTS **/
	/** HANDLERS **/
    const quickActions = [
		{ id: 1, label: 'Write Post', icon: '📝', link: '/community/write', color: '#667eea' },
		{ id: 2, label: 'Sell Item', icon: '🛒', link: '/mypage/add-product', color: '#10b981' },
		{ id: 3, label: 'Post Job', icon: '💼', link: '/jobs/create', color: '#f59e0b' },
		{ id: 4, label: 'New Event', icon: '📅', link: '/events/create', color: '#ec4899' },
	];

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<div>HeroSection</div>
			</Stack>
		);
	} else {
		return (
			<Stack className="homepage-container">
			{/* Hero Banner Section */}
			<Box className="hero-banner">
				<Box className="hero-content">
					<Box className="hero-title">
						<Zap size={32} className="hero-icon" />
						<h1>Welcome to Cuben Community</h1>
					</Box>
					<p className="hero-subtitle">
						Connect with students, discover opportunities, and trade items all in one place
					</p>

					{/* Quick Actions */}
					<Stack className="quick-actions">
						{quickActions.map((action) => (
							<Link key={action.id} href={action.link} style={{ textDecoration: 'none' }}>
								<Box className="quick-action-card" style={{ borderColor: action.color }}>
									<Box className="action-icon" style={{ background: action.color }}>
										{action.icon}
									</Box>
									<span>{action.label}</span>
								</Box>
							</Link>
						))}
					</Stack>
				</Box>
			</Box>	
		</Stack>
		);
	}
};

export default HeroSection;
