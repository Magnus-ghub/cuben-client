import { Box, Stack, SvgIcon } from "@mui/material";
import Link from "next/link";
import useDeviceDetect from "../hooks/useDeviceDetect";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

// Cuben Logo SVG Component
const CubenLogo = () => (
  <svg 
    width="56" 
    height="56" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: "#5DDBF4", stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: "#7B9FF5", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: "#9B7FED", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    
    <path 
      d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z" 
      fill="none" 
      stroke="url(#cubeGradient)" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    <path 
      d="M 50 15 L 50 50" 
      stroke="url(#cubeGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
    
    <path 
      d="M 15 35 L 50 50" 
      stroke="url(#cubeGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
    
    <path 
      d="M 85 35 L 50 50" 
      stroke="url(#cubeGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
  </svg>
);

const Top = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className={'top'}>
				<Link href={'/'}>
					<div>{('Home')}</div>
				</Link>
				<Link href={'/property'}>
					<div>{('Properties')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {('CS')} </div>
				</Link>
			</Stack>
    );
  }

  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container"}>
          {/* Logo Section */}
          <Link href={"/"} style={{ textDecoration: "none" }}>
            <Stack className="logo-section">
              <Box component={"div"} className={"logo-box"}>
                <CubenLogo />
              </Box>
              <Box component={"div"} className={"brand-name"}>
                <div className="brand-text">cuben</div>
                <div className="univ-text">부산외국어대학교</div>
              </Box>
            </Stack>
          </Link>

          {/* Search Box */}
          <Box component={"div"} className={"search-box"}>
            <SearchIcon className="search-icon" />
            <input type="text" placeholder="Cuben에서 검색..." />
          </Box>

          {/* Icon Box */}
          <Box component={"div"} className={"icon-box"}>
            <div className="icon-wrapper">
              <SvgIcon component={NotificationsIcon} />
              <span className="notification-badge">3</span>
            </div>
            <div className="icon-wrapper">
              <SvgIcon component={ChatIcon} />
              <span className="notification-badge">2</span>
            </div>
            <div className="icon-wrapper profile">
              <SvgIcon component={PersonIcon} />
            </div>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Top;