import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import Advertisement from "../libs/components/homepage/Advertisement";
import PopularProducts from "../libs/components/homepage/PopularProducts";

const Home: NextPage = () => {
  return (
    <Container>
      <Stack flexDirection={"column"}>
         <Advertisement />
         <PopularProducts />
        <div>HomePage</div>
      </Stack>
    </Container>
  );
}

export default withLayoutMain(Home);
