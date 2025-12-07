import { Box, Stack, SvgIcon } from "@mui/material";
import Link from "next/link";
import useDeviceDetect from "../hooks/useDeviceDetect";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const Top = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className={"navbar"}>
        <Link href={"/"}>
          <div>Home</div>
        </Link>
        <Link href={"/product"}>
          <div>Products</div>
        </Link>
        <Link href={"/agent"}>
          <div>Agents</div>
        </Link>
        <Link href={"/community"}>
          <div>Community</div>
        </Link>

        <Link href={"/cs"}>
          <div>CS</div>
        </Link>
      </Stack>
    );
  }
  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container"}>
          <Box component={"div"} className={"logo-box"}>
              <img src="/img/logo/cuben.logo.png" alt="" />
          </Box>
          <Box component={"div"} className={"search-box"}>
            <input type="" placeholder="search cuben" />
          </Box>
          <Box component={"div"} className={"icon-box"}>
              <SvgIcon component={NotificationsIcon} inheritViewBox />
              <SvgIcon component={ChatIcon} inheritViewBox />
              <SvgIcon component={PersonIcon} inheritViewBox />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Top;
