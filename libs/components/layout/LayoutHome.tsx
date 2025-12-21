import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LeftSidebar from "../Left-sidebar";
import Chat from "../Chat";

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
              </Stack>
            </Stack>

            <Chat />
            
          </Stack>
        </>
      );
    }

    // PC
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
						{/* Left Sidebar - Always visible */}
						<Stack id="left-sidebar">
							<LeftSidebar />
						</Stack>

						{/* Main Content - Always takes remaining space */}
						<Stack id="main-content-wrapper">
							<Stack id="main">
								<Stack id={"main-section"}>
									<Component {...props} />
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					<Chat />
				</Stack>
      </>
    );
  };
};

export default withLayoutMain;
