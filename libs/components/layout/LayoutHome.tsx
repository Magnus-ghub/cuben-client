import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Footer from "../Footer";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LeftSidebar from "../Left-sidebar";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>Cuben</title>
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>

            <Stack direction="row" id="layout-body">
              <Stack id="left-sidebar">
                <LeftSidebar />
              </Stack>

              <Stack id="main">
                <Stack id={"main-section"}>
                  <Component {...props} />
                </Stack>

                <Stack id={"footer"}>
                  <Footer />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </>
      );
    }

    // DESKTOP
    return (
      <>
        <Head>
          <title>Cuben</title>
        </Head>

        <Stack id="pc-wrap">
          <Stack id={"top"}>
            <Top />
          </Stack>

          <Stack direction="row" id="layout-body">
            <Stack id="left-sidebar">
              <LeftSidebar />
            </Stack>

            <Stack id="main">
              <Stack id={"main-section"}>
                <Component {...props} />
              </Stack>

              <Stack id={"footer"}>
                <Footer />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutMain;
