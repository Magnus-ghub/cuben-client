import { Stack } from "@mui/material";
import Head from "next/head";
import HaederFilter from "../homepage/HeadFilter";


const withLayoutMain = (Component: any) => {
  return (props: any) => {
    return (
      <>
        <Head>
          <title>Nestar</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack id={"top"}>
          </Stack>
          <Stack className={"header-main"}>
            <Stack className={"container"}>
              <HaederFilter />
            </Stack>
          </Stack>

          <Stack id={"main"}>
            <Component {...props} />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutMain;