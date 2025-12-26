import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Stack } from '@mui/material';
import React from 'react';
import { userVar } from '../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import PopularProducts from './homepage/PopularProducts';
import Events from './homepage/Events';
import FeatureJobs from './homepage/FeatureJobs';

const RightSidebar = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	if (device === 'mobile') {
		return null; // Mobile'da Right Sidebar ko'rsatmaydi
	}

	return (
		<Stack className="right-sidebar-section">
			<Stack className="sticky-wrapper">
				<PopularProducts />
				<FeatureJobs />
				<Events />
			</Stack>
		</Stack>
	);
};

export default RightSidebar;