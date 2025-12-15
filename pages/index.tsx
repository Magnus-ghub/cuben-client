import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import PopularProducts from "../libs/components/homepage/PopularProducts";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import CommunityBoards from "../libs/components/homepage/Community";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeroSection from "../libs/components/homepage/HeroSection";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className={"home-page"}>
         <HeroSection />
        <PopularProducts />
        <CommunityBoards />
      </Stack>
    );
  } else {
    return (
        <Stack className={'home-page'}>
          <HeroSection />
          <PopularProducts />
          <CommunityBoards />
        </Stack>
    );
  }
};

export default withLayoutMain(Home);
