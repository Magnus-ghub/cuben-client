import { Logout } from "@mui/icons-material";
import { Box, Menu, MenuItem, Stack } from "@mui/material";
import Link from "next/link";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { Settings, HelpCircle, Icon } from "lucide-react";

const LeftSidebar = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return <Stack className={"navbar"}></Stack>;
  }
  return (
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container"}>
          <Link href="/profile">
            <Stack className="profile-card">
              <Stack className="profile-header">
                <Box className="profile-avatar">
                  <img src="/img/profile/defaultUser.svg" alt="Profile" />
                </Box>
                <Stack className="profile-info">
                  <Box className="profile-name">Kim Student</Box>
                  <Box className="profile-username">@kimstudent</Box>
                </Stack>
              </Stack>

              <Stack className="profile-stats">
                <Stack className="stat-item">
                  <Box className="stat-number">125</Box>
                  <Box className="stat-label">Followers</Box>
                </Stack>
                <Stack className="stat-item">
                  <Box className="stat-number">89</Box>
                  <Box className="stat-label">Following</Box>
                </Stack>
              </Stack>
            </Stack>
          </Link>

          {/* Sidebar Content */}
          <Stack className="sidebar-content">
            {/* HOME Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">🏠 HOME</Box>

              <Link href={"/product"}>
                <Stack className={`menu-item `}>
                  <Icon className="menu-icon" size={20} iconNode={[]} />
                  <Box className="menu-text"></Box>
                  <Box className="menu-badge"></Box>
                </Stack>
              </Link>
            </Stack>

            {/* MY ACTIVITY Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">❤️ MY ACTIVITY</Box>

              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Icon className="menu-icon" size={20} iconNode={[]} />
                  <Box className="menu-text"></Box>
                </Stack>
              </Link>
            </Stack>

            {/* CATEGORIES Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">🏷️ CATEGORIES</Box>
              <Link href={"/home"}>
                <Stack className={`menu-item`}>
                  <Icon className="menu-icon" size={20} iconNode={[]} />
                  <Box className="menu-text">{}</Box>
                  <Box className="menu-count">{}</Box>
                </Stack>
              </Link>
            </Stack>
          </Stack>

          {/* Bottom Section */}
          <Stack className="sidebar-bottom">
            <Link href="/settings">
              <Stack className="bottom-item">
                <Settings size={18} />
                <Box>Settings</Box>
              </Stack>
            </Link>
            <Link href="/help">
              <Stack className="bottom-item">
                <HelpCircle size={18} />
                <Box>Help & Support</Box>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LeftSidebar;
