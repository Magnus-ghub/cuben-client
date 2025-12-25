import { Stack, Box } from '@mui/material';
import { NextPage, NextPageContext } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '../libs/components/homepage/HeroSection';
import MainSection from '../libs/components/homepage/MainSection';
import RightSidebar from '../libs/components/Right-Sidebar';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';
import { FunctionComponent } from 'react';
import withLayoutMain from '../libs/components/layout/LayoutHome';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<Box className="content-wrapper">
					<Box className="main-feed-section">
						<HeroSection />
						<MainSection />
					</Box>
					<RightSidebar />
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Box className="content-wrapper">
					<Box className="main-feed-section">
						<HeroSection />
						<MainSection />
					</Box>
					<RightSidebar />
				</Box>
			</Stack>
		);
	}
};

export default withLayoutMain(Home);

