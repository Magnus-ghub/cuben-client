import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import { Box, Stack, Menu, MenuItem, Drawer, AppBar, Avatar, IconButton, Divider, Typography, Badge } from '@mui/material';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import { userVar } from '../../apollo/store';
import { LogOut, Bell, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';

const drawerWidth = 280;

const withAdminLayout = (Component: ComponentType) => {
    return (props: object) => {
        const router = useRouter();
        const user = useReactiveVar(userVar);
        const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const jwt = getJwtToken();
            if (jwt) updateUserInfo(jwt);
            setLoading(false);
        }, []);

        useEffect(() => {
            if (!loading && user.memberType !== MemberType.ADMIN) {
                router.push('/').then();
            }
        }, [loading, user, router]);

        const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorElUser(event.currentTarget);
        };

        const handleCloseUserMenu = () => {
            setAnchorElUser(null);
        };

        const logoutHandler = () => {
            logOut();
            router.push('/').then();
        };

        if (!user || user?.memberType !== MemberType.ADMIN) return null;

        return (
            <Box className="admin-dashboard">
                <AppBar className="admin-appbar" position="fixed">
                    <Box className="appbar-content">
                        <Box className="appbar-left">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LayoutDashboard size={24} color="#6366f1" />
                                <Typography className="page-title">Cuben Management</Typography>
                            </Stack>
                        </Box>
                        
                        <Box className="appbar-right">
                            <IconButton className="icon-btn">
                                <Badge badgeContent={5} color="error">
                                    <Bell size={20} />
                                </Badge>
                            </IconButton>

                            <Box className="user-menu-trigger" onClick={handleOpenUserMenu}>
                                <Avatar
                                    src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
                                    className="user-avatar"
                                />
                                <Box className="user-info">
                                    <Typography className="user-name">{user?.memberNick}</Typography>
                                    <Typography className="user-role">Super Admin</Typography>
                                </Box>
                                <ChevronDown size={18} />
                            </Box>

                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                className="user-dropdown"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <Box className="dropdown-header">
                                    <Typography className="dropdown-name">{user?.memberNick}</Typography>
                                    <Typography className="dropdown-email">{user?.memberPhone}</Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={logoutHandler} className="logout-item">
                                    <LogOut size={18} />
                                    <span>Tizimdan chiqish</span>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </AppBar>

                <Drawer className="admin-sidebar" variant="permanent">
                    <Box className="sidebar-header">
                        <Box className="logo-wrapper">
                            <img src="/img/logo/logoText.svg" alt="Cuben Logo" />
                        </Box>
                    </Box>

                    <Box className="sidebar-user-card">
                        <Avatar
                            src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
                            className="sidebar-avatar"
                        />
                        <Box className="sidebar-user-info">
                            <Typography className="sidebar-user-name">{user?.memberNick}</Typography>
                            <Typography className="sidebar-user-role">Admin Panel</Typography>
                        </Box>
                    </Box>

                    <Divider className="sidebar-divider" />
                    <MenuList />
                </Drawer>

                <Box className="admin-content">
                    <Component {...props} />
                </Box>
            </Box>
        );
    };
};

export default withAdminLayout;