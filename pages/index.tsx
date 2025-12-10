import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Advertisement from "../libs/components/homepage/Advertisement";
import PopularProducts from "../libs/components/homepage/PopularProducts";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import CommunityBoards from "../libs/components/homepage/Community";
import Events from "../libs/components/homepage/Event";

const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === 'mobile') {
    return (
      <Stack className={'home-page'}>
        <PopularProducts />
      </Stack>
    )
  }
  return (
    <Container>
      <Stack flexDirection={"column"}>
         <PopularProducts />
         <Advertisement />
         <CommunityBoards />
         <Events />
        <div>HomePage</div>
      </Stack>
    </Container>
  );
}

export default withLayoutMain(Home);
