import { Logout } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <Box id="pc-wrap">
      {/* Mobile Menu Toggle Button */}
      <Box
        className={`mobile-menu-toggle ${sidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      >
        <span></span>
      </Box>

      {/* Sidebar Overlay */}
      <Box
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      {/* Left Sidebar Navigation */}
      <Stack className={`sidebar-nav ${sidebarOpen ? "active" : ""}`}>
        {/* Logo Section */}
        <Box className="logo-section">
          <Box className="logo-box">
            <Link href="/" onClick={closeSidebar}>
              <img src="/img/logo/logoWhite.svg" alt="Logo" />
            </Link>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box className="nav-links">
          <Link href="/" onClick={closeSidebar}>
            <Box className={`nav-item ${isActive("/") ? "active" : ""}`}>
              <span>Home</span>
            </Box>
          </Link>

          <Link href="/product" onClick={closeSidebar}>
            <Box className={`nav-item ${isActive("/product") ? "active" : ""}`}>
              <span>Product</span>
            </Box>
          </Link>

          <Link href="/agent" onClick={closeSidebar}>
            <Box className={`nav-item ${isActive("/agent") ? "active" : ""}`}>
              <span>Agents</span>
            </Box>
          </Link>

          <Link href="/community?articleCategory=FREE" onClick={closeSidebar}>
            <Box
              className={`nav-item ${isActive("/community") ? "active" : ""}`}
            >
              <span>Community</span>
            </Box>
          </Link>

          <Link href="/cs" onClick={closeSidebar}>
            <Box className={`nav-item ${isActive("/cs") ? "active" : ""}`}>
              <span>CS</span>
            </Box>
          </Link>
        </Box>

        {/* User Section */}
        <Box className="user-section">
          <Box className="user-profile">
            <img
              src="/img/profile/default.svg"
              alt="User Avatar"
              className="user-avatar"
            />
            <Box className="user-info">
              <Box className="user-name">John Doe</Box>
              <Box className="user-email">john@example.com</Box>
            </Box>
          </Box>

          <Box className="logout-btn">
            <Logout fontSize="small" />
            <span>Logout</span>
          </Box>
        </Box>
      </Stack>

      {/* Main Content Area */}
      <Box className="main-content">{children}</Box>
    </Box>
  );
};

export default SidebarLayout;