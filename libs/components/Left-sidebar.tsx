import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
	Settings,
	HelpCircle,
	Heart,
	Eye,
	ShoppingBag,
	Monitor,
	Book,
	Pizza,
	House,
	TrendingUp,
	Calendar,
	Notebook,
	LogOut,
	Store,
	Package,
	LayoutDashboard,
	MessageSquare,
	BookmarkIcon,
	InfoIcon,
} from 'lucide-react';
import { logOut } from '../auth';
import React from 'react';
import { userVar } from '../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';

const LeftSidebar = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [logoutOpen, setLogoutOpen] = React.useState(false);

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
										<img src={user?.memberImage || '/img/profile/defaultUser.svg'} alt="Profile" />
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
									<House size={20} className="menu-icon" />
									<Box className="menu-text">Home</Box>
								</Stack>
							</Link>
							<Link href={'/product'}>
								<Stack className={`menu-item ${isActive('/product') ? 'active' : ''}`}>
									<Store size={20} className="menu-icon" />
									<Box className="menu-text">Marketplace</Box>
								</Stack>
							</Link>
							<Link href={'/trending'}>
								<Stack className={`menu-item ${isActive('/trending') ? 'active' : ''}`}>
									<TrendingUp size={20} className="menu-icon" />
									<Box className="menu-text">Trending</Box>
								</Stack>
							</Link>
						</Stack>

						{/* MY ACTIVITY Section - Faqat login qilgan userlar uchun */}
						{user?._id && (
							<Stack className="sidebar-section">
								<Box className="section-title">⚡ MY ACTIVITY</Box>

								<Link href={'/mypage'}>
									<Stack className={`menu-item ${isActive('/mypage') ? 'active' : ''}`}>
										<LayoutDashboard size={20} className="menu-icon" />
										<Box className="menu-text">Dashboard</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/my-products'}>
									<Stack className={`menu-item ${isActive('/mypage/my-products') ? 'active' : ''}`}>
										<Package size={20} className="menu-icon" />
										<Box className="menu-text">My Products</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/favorites'}>
									<Stack className={`menu-item ${isActive('/mypage/favorites') ? 'active' : ''}`}>
										<Heart size={20} className="menu-icon" />
										<Box className="menu-text">Favorites</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/saved'}>
									<Stack className={`menu-item ${isActive('/mypage/saved') ? 'active' : ''}`}>
										<BookmarkIcon size={20} className="menu-icon" />
										<Box className="menu-text">Saved</Box>
									</Stack>
								</Link>

								<Link href={'/mypage/messages'}>
									<Stack className={`menu-item ${isActive('/mypage/messages') ? 'active' : ''}`}>
										<MessageSquare size={20} className="menu-icon" />
										<Box className="menu-text">Messages</Box>
										<Box className="menu-badge">5</Box>
									</Stack>
								</Link>
							</Stack>
						)}

						{/* MARKETPLACE Section */}
						<Stack className="sidebar-section">
							<Box className="section-title">🏪 CATEGORIES</Box>
							<Link href={'/product?category=all'}>
								<Stack className={`menu-item ${isActive('/product') && router.query.category === 'all' ? 'active' : ''}`}>
									<ShoppingBag size={20} className="menu-icon" />
									<Box className="menu-text">All Products</Box>
									<Box className="menu-count">245</Box>
								</Stack>
							</Link>
							<Link href={'/product?category=electronics'}>
								<Stack className={`menu-item ${router.query.category === 'electronics' ? 'active' : ''}`}>
									<Monitor size={20} className="menu-icon" />
									<Box className="menu-text">Electronics</Box>
									<Box className="menu-count">87</Box>
								</Stack>
							</Link>
							<Link href={'/product?category=books'}>
								<Stack className={`menu-item ${router.query.category === 'books' ? 'active' : ''}`}>
									<Book size={20} className="menu-icon" />
									<Box className="menu-text">Books</Box>
									<Box className="menu-count">56</Box>
								</Stack>
							</Link>
							<Link href={'/product?category=food'}>
								<Stack className={`menu-item ${router.query.category === 'food' ? 'active' : ''}`}>
									<Pizza size={20} className="menu-icon" />
									<Box className="menu-text">Food Share</Box>
									<Box className="menu-count">43</Box>
								</Stack>
							</Link>
						</Stack>

						{/* TOOLS Section - Calendar va Notes */}
						<Stack className="sidebar-section">
							<Box className="section-title">🛠️ TOOLS</Box>
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
						<Link href="/settings">
							<Stack className="bottom-item">
								<Settings size={20} className="menu-icon" />
								<Box>Settings</Box>
							</Stack>
						</Link>
						<Link href="/help">
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