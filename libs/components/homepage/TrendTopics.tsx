import React from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const TrendTopics = () => {
	const device = useDeviceDetect();

	// Mock Data - Keyinchalik API dan keladi
	const trendingTopics = [
		{ id: 1, name: 'Campus Life', count: 1234, icon: '🎓' },
		{ id: 2, name: 'Study Tips', count: 892, icon: '📚' },
		{ id: 3, name: 'Part-time Jobs', count: 654, icon: '💼' },
		{ id: 4, name: 'Food Deals', count: 543, icon: '🍕' },
		{ id: 5, name: 'Tech Sales', count: 432, icon: '💻' },
	];

	if (device === 'mobile') {
		return (
			<Stack className="trending-section">
				<div>TrendTopics Mobile</div>
			</Stack>
		);
	}

	return (
		<Stack className="trending-section">
			<Box className="trending-card">
				<Box className="card-header">
					<Flame size={20} className="header-icon flame" />
					<h3>Trending Topics</h3>
					<Link href="/trending" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="trending-list">
					{trendingTopics.map((topic, index) => (
						<Link 
							key={topic.id} 
							href={`/search?q=${topic.name}`} 
							style={{ textDecoration: 'none' }}
						>
							<Box className="trending-item">
								<Box className="trending-info">
									<span className="trend-icon">{topic.icon}</span>
									<Box className="trend-details">
										<span className="trend-name">{topic.name}</span>
										<span className="trend-count">{topic.count.toLocaleString()} posts</span>
									</Box>
								</Box>
								<Box className="trend-rank">#{index + 1}</Box>
							</Box>
						</Link>
					))}
				</Stack>
			</Box>
		</Stack>
	);
};

export default TrendTopics;