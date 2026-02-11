import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Zap } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const HeroSection = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const quickActions = [
		{ id: 1, label: 'writePost', icon: '📝', color: '#667eea' },
		{ id: 2, label: 'sellItem', icon: '🛒', color: '#10b981' },
		{ id: 3, label: 'postJob', icon: '💼', color: '#f59e0b' },
		{ id: 4, label: 'newEvent', icon: '📅', color: '#ec4899' },
	];

	if (device === 'mobile') {
		return (
			<Stack className="hero-section">
				<Box>{t('welcome_title')}</Box>
			</Stack>
		);
	}

	return (
		<Box className="hero-banner">
			<Box className="hero-content">
				<Box className="hero-title">
					<Zap size={32} className="hero-icon" />
					<h1>{t('welcome_title')}</h1>
				</Box>

				<p className="hero-subtitle">{t('welcome_subtitle')}</p>

				{/* Quick Actions */}
				<Stack className="quick-actions">
					{quickActions.map((action) => (
						<Box key={action.id}>
							<Box className="quick-action-card" sx={{ borderColor: action.color }}>
								<Box className="action-icon" sx={{ background: action.color }}>
									{action.icon}
								</Box>

								<span>{t(action.label)}</span>
							</Box>
						</Box>
					))}
				</Stack>
			</Box>
		</Box>
	);
};

export default HeroSection;
