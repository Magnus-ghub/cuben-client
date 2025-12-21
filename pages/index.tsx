import { Stack, Box } from '@mui/material';
import { NextPage } from 'next';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '../libs/components/homepage/HeroSection';
import Events from '../libs/components/homepage/Events';
import TrendTopics from '../libs/components/homepage/TrendTopics';
import FeatureJobs from '../libs/components/homepage/FeatureJobs';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import MainSection from '../libs/components/homepage/MainSection';

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
				<HeroSection />
				<Box className="content-wrapper">
					<Box>
						<TrendTopics />
						<Events />
					</Box>
					<MainSection />
					<Box>
						<FeatureJobs />
						<PopularProducts />
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<Box className="content-wrapper">
					<Box>
						{/* <TrendTopics /> */}
						<FeatureJobs />
						<Events />
					</Box>
					<MainSection />
					<Box>
						{/* <FeatureJobs /> */}
						<PopularProducts />
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
