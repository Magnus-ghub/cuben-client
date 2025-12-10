import { Box, Stack } from "@mui/material";
import Link from "next/link";
import useDeviceDetect from "../hooks/useDeviceDetect";
import {
  Settings,
  HelpCircle,
  Heart,
  Eye,
  ScrollText,
  Monitor,
  Book,
  Pizza,
  House,
  TrendingUp,
  MessageCircle,
  Calendar,
  Notebook,
  LogOut,
  Newspaper,
} from "lucide-react";

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
                  <Box className="profile-name">Magnus</Box>
                  <Box className="profile-username">@magnuskordev</Box>
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
              <Link href={"/"}>
                <Stack className={`menu-item `}>
                  <House size={20} className="menu-icon" />
                  <Box className="menu-text">Home</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item `}>
                  <TrendingUp size={20} className="menu-icon" />
                  <Box className="menu-text">Tranding</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item `}>
                  <Newspaper size={20} className="menu-icon" />
                  <Box className="menu-text">Announcements</Box>
                </Stack>
              </Link>
            </Stack>

            {/* Schedule Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">📅 SCHEDULE</Box>
              <Link href={"/calendar"}>
                <Stack className={`menu-item `}>
                  <Calendar size={20} className="menu-icon" />
                  <Box className="menu-text">Calendar</Box>
                </Stack>
              </Link>
              <Link href={"/notes"}>
                <Stack className={`menu-item `}>
                  <Notebook size={20} className="menu-icon" />
                  <Box className="menu-text">Notes</Box>
                </Stack>
              </Link>
            </Stack>

            {/* MY ACTIVITY Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">❤️ MY ACTIVITY</Box>

              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Heart size={20} className="menu-icon" />
                  <Box className="menu-text">Favorites</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Eye size={20} className="menu-icon" />
                  <Box className="menu-text">Recently Viewed</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <ScrollText size={20} className="menu-icon" />
                  <Box className="menu-text">My Products</Box>
                </Stack>
              </Link>
            </Stack>

            {/* CATEGORIES Section */}
            <Stack className="sidebar-section">
              <Box className="section-title">🏷️ MARKETPLACE</Box>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Monitor size={20} className="menu-icon" />
                  <Box className="menu-text">Electronics</Box>
                  <Box className="menu-count">34</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Book size={20} className="menu-icon" />
                  <Box className="menu-text">Books</Box>
                  <Box className="menu-count">45</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <Pizza size={20} className="menu-icon" />
                  <Box className="menu-text">Food Share</Box>
                  <Box className="menu-count">65</Box>
                </Stack>
              </Link>
              <Link href={"/product"}>
                <Stack className={`menu-item`}>
                  <ScrollText size={20} className="menu-icon" />
                  <Box className="menu-text">Others</Box>
                  <Box className="menu-count">78</Box>
                </Stack>
              </Link>
            </Stack>
          </Stack>

          {/* Bottom Section */}
          <Stack className="sidebar-bottom">
            <Link href="/cs">
              <Stack className="bottom-item">
                <Settings size={20} className="menu-icon" />
                <Box>Settings</Box>
              </Stack>
            </Link>
            <Link href="/cs">
              <Stack className="bottom-item">
                <HelpCircle size={20} className="menu-icon" />
                <Box>Help & Support</Box>
              </Stack>
            </Link>
            <Link href="/cs">
              <Stack className="bottom-item">
                <LogOut size={20} className="menu-icon" />
                <Box>Logout</Box>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LeftSidebar;
