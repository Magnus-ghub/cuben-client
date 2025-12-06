import { Box, Container, Stack } from "@mui/material";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";

const Home: NextPage = () => {
  return (
    <Container>
      <Stack flexDirection={"column"}>
      </Stack>
    </Container>
  );
}

export default withLayoutMain(Home);
