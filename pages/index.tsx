import { Stack, Box } from '@mui/material';
import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '../libs/components/homepage/HeroSection';
import MainSection from '../libs/components/homepage/MainSection';
import RightSidebar from '../libs/components/Right-Sidebar';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';

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
				<div>MOBILE HOMEPAGE SECTION</div>
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Box className="content-wrapper">
					{/* CENTER COLUMN - MAIN FEED (60% width) */}
					<Box className="main-feed-section">
						<HeroSection />
						<MainSection />
					</Box>

					{/* RIGHT SIDEBAR - MARKETPLACE & MORE (30% width, sticky) */}
					<RightSidebar />
				</Box>
			</Stack>
		);
	}
};

export default withLayoutBasic(Home);