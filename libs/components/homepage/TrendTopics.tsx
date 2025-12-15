import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { Flame, Image as ImageIcon } from 'lucide-react';

const TrendTopics = () => {
	const device = useDeviceDetect();

	const trendingTopics = [
		{ id: 1, name: 'Campus Life', count: 1234, icon: '🎓' },
		{ id: 2, name: 'Study Tips', count: 892, icon: '📚' },
		{ id: 3, name: 'Part-time Jobs', count: 654, icon: '💼' },
		{ id: 4, name: 'Food Deals', count: 543, icon: '🍕' },
		{ id: 5, name: 'Tech Sales', count: 432, icon: '💻' },
	];

	/** APOLLO REQUESTS **/
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<div>TrendTopikcs Mobile</div>
		);
	} else {
		return (
			<Stack className="main-content">
				{/* Left Sidebar - Trending & Events */}
				<Box className="left-sidebar">
					{/* Trending Topics */}
					<Box className="trending-card">
						<Box className="card-header">
							<Flame size={20} className="header-icon flame" />
							<h3>Trending Topics</h3>
						</Box>
						<Stack className="trending-list">
							{trendingTopics.map((topic, index) => (
								<Link key={topic.id} href={`/search?q=${topic.name}`} style={{ textDecoration: 'none' }}>
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
				</Box>
			</Stack>
		);
	}
};

export default TrendTopics;
