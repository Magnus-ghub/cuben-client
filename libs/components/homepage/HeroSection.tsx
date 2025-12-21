import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Zap } from 'lucide-react';

const HeroSection = () => {
	const device = useDeviceDetect();

	const quickActions = [
		{ id: 1, label: 'Write Post', icon: '📝', color: '#667eea' },
		{ id: 2, label: 'Sell Item', icon: '🛒', color: '#10b981' },
		{ id: 3, label: 'Post Job', icon: '💼', color: '#f59e0b' },
		{ id: 4, label: 'New Event', icon: '📅', color: '#ec4899' },
	];

	if (device === 'mobile') {
		return (
			<Stack className="hero-section">
				<div>HeroSection Mobile</div>
			</Stack>
		);
	}

	return (
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
						<Box key={action.id}  style={{ textDecoration: 'none' }}>
							<Box className="quick-action-card" style={{ borderColor: action.color }}>
								<Box className="action-icon" style={{ background: action.color }}>
									{action.icon}
								</Box>
								<span>{action.label}</span>
							</Box>
						</Box>
					))}
				</Stack>
			</Box>
		</Box>
	);
};

export default HeroSection;