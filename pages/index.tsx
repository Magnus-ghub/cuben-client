import { Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Advertisement from "../libs/components/homepage/Advertisement";
import PopularProducts from "../libs/components/homepage/PopularProducts";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import CommunityBoards from "../libs/components/homepage/Community";
import Events from "../libs/components/homepage/Event";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
        <PopularProducts />
        <Advertisement />
        <CommunityBoards />
        <Events />
      </Stack>
    );
  } else {
    return (
        <Stack className={'home-page'}>
          <PopularProducts />
          <Advertisement />
          <CommunityBoards />
          <Events />
        </Stack>
    );
  }
};

export default withLayoutMain(Home);
