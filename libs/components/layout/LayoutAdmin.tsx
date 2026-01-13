import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import {
	Box,
	Stack,
	Menu,
	MenuItem,
	Drawer,
	AppBar,
	Avatar,
	IconButton,
	Divider,
	Typography,
	Badge,
	Link,
} from '@mui/material';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useReactiveVar } from '@apollo/client';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import { userVar } from '../../apollo/store';
import { LogOut, Bell, ChevronDown, LayoutDashboard } from 'lucide-react';

const drawerWidth = 280;

const CubenLogo: React.FC = () => (
	<svg width="55" height="55" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
				<stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
			</linearGradient>
		</defs>
		<path
			d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z"
			fill="none"
			stroke="url(#cubeGradient)"
			strokeWidth="6"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path d="M 50 15 L 50 50" stroke="url(#cubeGradient)" strokeWidth="6" strokeLinecap="round" />
		<path d="M 15 35 L 50 50" stroke="url(#cubeGradient)" strokeWidth="6" strokeLinecap="round" />
		<path d="M 85 35 L 50 50" stroke="url(#cubeGradient)" strokeWidth="6" strokeLinecap="round" />
	</svg>
);

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
									<Typography className="user-role">Staff</Typography>
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
								PaperProps={{
									sx: {
										mt: 1,
										minWidth: 200,
										borderRadius: '12px',
										boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
									},
								}}
							>
								<Box className="dropdown-header" sx={{ p: '16px 20px' }}>
									<Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{user?.memberNick}</Typography>
									<Typography sx={{ fontSize: '12px', color: '#64748b', mt: 0.5 }}>University Staff</Typography>
								</Box>
								<Divider />
								<Link
									href="/"
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: '10px',
										padding: '12px 20px',
										color: '#334155',
										textDecoration: 'none',
										fontSize: '14px',
										fontWeight: 500,
										transition: 'all 0.2s ease',
										'&:hover': {
											background: '#f8fafc',
											color: '#6366f1',
											'& svg': {
												transform: 'translateX(-3px)',
											},
										},
										'& svg': {
											color: '#6366f1',
											transition: 'transform 0.2s ease',
										},
									}}
								>
									<KeyboardReturnIcon />
									<span>Back to Cuben</span>
								</Link>
							</Menu>
						</Box>
					</Box>
				</AppBar>

				<Drawer className="admin-sidebar" variant="permanent">
					<Box className="sidebar-header">
						<Box className="logo-wrapper">
							<CubenLogo />
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
