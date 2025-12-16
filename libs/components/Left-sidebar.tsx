import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
	HelpCircle,
	Heart,
	History,
	ShoppingBag,
	Monitor,
	Book,
	House,
	Calendar,
	Notebook,
	LogOut,
	Users,
	Briefcase,
	Newspaper,
	GraduationCap,
	MessageSquare,
	BookmarkIcon,
	InfoIcon,
	PenSquare,
	BellDot,
	Store,
	LayoutList,
} from 'lucide-react';
import { logOut } from '../auth';
import React, { useState, useEffect } from 'react';
import { userVar } from '../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../config';

const LeftSidebar = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [imageError, setImageError] = useState(false);

	// Reset image error when user changes
	useEffect(() => {
		setImageError(false);
	}, [user?.memberImage]);

	const handleLogout = async () => {
		try {
			await logOut();
			userVar(null);
			window.location.href = '/';
		} catch (e) {
			console.error(e);
		}
	};

	// Helper function to check if route is active
	const isActive = (path: string) => {
		return router.pathname === path;
	};

	// Helper function to get user image with fallback
	const getUserImageSrc = () => {
		if (imageError) {
			return '/img/profile/defaultUser.svg';
		}
		if (user?.memberImage) {
			return `${REACT_APP_API_URL}/${user.memberImage}`;
		}
		return '/img/profile/defaultUser.svg';
	};

	const handleImageError = () => {
		setImageError(true);
	};

	if (device === 'mobile') {
		return <Stack className={'navbar'}></Stack>;
	}

	return (
		<Stack className={'navbar'}>
			<Stack className={'navbar-main'}>
				<Stack className={'container'}>
					{/* Profile Card */}
					{user?._id && (
						<Link href="/mypage" style={{ textDecoration: 'none' }}>
							<Stack className="profile-card">
								<Stack className="profile-header">
									<Box className="profile-avatar">
										<img
											src={getUserImageSrc()}
											alt={user.memberNick || 'User profile'}
											onError={handleImageError}
										/>
									</Box>
									<Stack className="profile-info">
										<Box className="profile-name">{user.memberNick}</Box>
										<Box className="profile-username">@{user.memberNick?.toLowerCase()}</Box>
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
					)}

					{/* Sidebar Content */}
					<Stack className="sidebar-content">
						{/* HOME Section */}
						<Stack className="sidebar-section">
							<Box className="section-title">🏠 HOME</Box>
							<Link href={'/'}>
								<Stack className={`menu-item ${isActive('/') ? 'active' : ''}`}>
									<LayoutList size={20} className="menu-icon" />
									<Box className="menu-text">Feed</Box>
								</Stack>
							</Link>
							<Link href={'/community?articleCategory=NOTICE'}>
								<Stack className={`menu-item ${router.query.articleCategory === 'NOTICE' ? 'active' : ''}`}>
									<Briefcase size={20} className="menu-icon" />
									<Box className="menu-text">Opportunities</Box>
									<Box className="menu-count">24</Box>
								</Stack>
							</Link>
							<Link href={'/product'}>
								<Stack className={`menu-item ${isActive('/product') && !router.query.category ? 'active' : ''}`}>
									<ShoppingBag size={20} className="menu-icon" />
									<Box className="menu-text">Marketplace</Box>
									<Box className="menu-count">245</Box>
								</Stack>
							</Link>
							<Link href={'/trending'}>
								<Stack className={`menu-item ${isActive('/mypage/messages') ? 'active' : ''}`}>
									<MessageSquare size={20} className="menu-icon" />
									<Box className="menu-text">Messages</Box>
									<Box className="menu-badge">5</Box>
								</Stack>
							</Link>
						</Stack>

						{/* MY ACTIVITY Section - Faqat login qilgan userlar uchun */}
						{user?._id && (
							<Stack className="sidebar-section">
								<Box className="section-title">⚡ MY ACTIVITY</Box>

								<Link href={'/mypage'}>
									<Stack className={`menu-item ${isActive('/mypage') ? 'active' : ''}`}>
										<GraduationCap size={20} className="menu-icon" />
										<Box className="menu-text">My Profile</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/favorites'}>
									<Stack className={`menu-item ${isActive('/mypage/favorites') ? 'active' : ''}`}>
										<Heart size={20} className="menu-icon" />
										<Box className="menu-text">Favorites</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/my-products'}>
									<Stack className={`menu-item ${isActive('/mypage/my-products') ? 'active' : ''}`}>
										<History size={20} className="menu-icon" />
										<Box className="menu-text">Recently Viewed</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/saved'}>
									<Stack className={`menu-item ${isActive('/mypage/saved') ? 'active' : ''}`}>
										<BookmarkIcon size={20} className="menu-icon" />
										<Box className="menu-text">Saved Items</Box>
									</Stack>
								</Link>
							</Stack>
						)}

						{/* TOOLS Section */}
						<Stack className="sidebar-section">
							<Box className="section-title">🛠️ Tools</Box>

							<Link href={'/calendar'}>
								<Stack className={`menu-item ${isActive('/calendar') ? 'active' : ''}`}>
									<Calendar size={20} className="menu-icon" />
									<Box className="menu-text">Calendar</Box>
								</Stack>
							</Link>

							<Link href={'/notes'}>
								<Stack className={`menu-item ${isActive('/notes') ? 'active' : ''}`}>
									<Notebook size={20} className="menu-icon" />
									<Box className="menu-text">Notes</Box>
								</Stack>
							</Link>
						</Stack>
					</Stack>

					{/* Bottom Section */}
					<Stack className="sidebar-bottom">
						<Link href="/cs">
							<Stack className="bottom-item">
								<HelpCircle size={20} className="menu-icon" />
								<Box>Help & Support</Box>
							</Stack>
						</Link>
						<Link href="/about">
							<Stack className="bottom-item">
								<InfoIcon size={20} className="menu-icon" />
								<Box>About</Box>
							</Stack>
						</Link>
						{user?._id && (
							<>
								<Stack
									className="bottom-item"
									direction="row"
									gap="10px"
									sx={{ cursor: 'pointer' }}
									onClick={() => setLogoutOpen(true)}
								>
									<LogOut size={20} className="menu-icon" />
									<Box>Logout</Box>
								</Stack>

								<Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
									<DialogTitle>Confirm Logout</DialogTitle>
									<DialogContent>Are you sure you want to log out?</DialogContent>
									<DialogActions>
										<Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
										<Button color="error" variant="contained" onClick={handleLogout}>
											Logout
										</Button>
									</DialogActions>
								</Dialog>
							</>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default LeftSidebar;