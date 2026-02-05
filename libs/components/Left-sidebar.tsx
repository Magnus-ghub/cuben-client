import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Stack, Dialog, DialogContent, DialogActions, Button, Skeleton } from '@mui/material';
import {
	HelpCircle,
	Heart,
	History,
	ShoppingBag,
	Calendar,
	Notebook,
	LogOut,
	Briefcase,
	GraduationCap,
	MessageSquare,
	BookmarkIcon,
	InfoIcon,
	LayoutList,
} from 'lucide-react';
import { logOut } from '../auth';
import React, { useState, useEffect } from 'react';
import { userVar } from '../apollo/store';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../config';
import { Snackbar, Alert } from '@mui/material';
import { GET_ARTICLES, GET_MEMBER, GET_PRODUCTS } from '../apollo/user/query';
import { T } from '../types/common';
import { sweetErrorHandling } from '../sweetAlert';

const LeftSidebar = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [comingSoonOpen, setComingSoonOpen] = useState(false);
	const [imageError, setImageError] = useState(false);

	const [stats, setStats] = useState({
		followers: 0,
		followings: 0,
	});

	// MODIFIED: onCompleted va onError olib tashlandi
	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		variables: { input: user?._id || '' },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
	});

	// MODIFIED: onCompleted ni useEffect ga o'zgartirish
	useEffect(() => {
		if (getMemberData?.getMember) {
			const member = getMemberData.getMember;
			setStats({
				followers: member.memberFollowers || 0,
				followings: member.memberFollowings || 0,
			});
		}
	}, [getMemberData]);

	// MODIFIED: onError ni useEffect ga o'zgartirish
	useEffect(() => {
		if (getMemberError) {
			sweetErrorHandling(getMemberError);
		}
	}, [getMemberError]);

	/** APOLLO REQUESTS – MODIFIED: Skip if no user, loading state */
	const { data: articlesData, loading: articlesLoading } = useQuery(GET_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 1,
				search: {},
			},
		},
		skip: !user?._id,
	});

	const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit: 1,
				search: {},
			},
		},
		skip: !user?._id,
	});

	const articlesCount = articlesData?.getArticles?.metaCounter[0]?.total || 0;
	const productsCount = productsData?.getProducts?.metaCounter[0]?.total || 0;

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
	const isActive = (path: string, queryKey?: string, queryValue?: string) => {
		const baseActive = router.pathname === path;
		if (queryKey && queryValue) {
			return baseActive && router.query[queryKey] === queryValue;
		}
		return baseActive;
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
										<img src={getUserImageSrc()} alt={user.memberNick || 'User profile'} onError={handleImageError} />
									</Box>
									<Stack className="profile-info">
										<Box className="profile-name">{user.memberNick}</Box>
										<Box className="profile-username">@{user.memberNick?.toLowerCase()}</Box>
									</Stack>
								</Stack>

								<Stack className="profile-stats">
									<Stack className="stat-item">
										<Box className="stat-number">
											{getMemberLoading ? (
												<Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 40, height: 24 }} />
											) : (
												stats.followers
											)}
										</Box>
										<Box className="stat-label">Followers</Box>
									</Stack>
									<Stack className="stat-item">
										<Box className="stat-number">
											{getMemberLoading ? (
												<Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 40, height: 24 }} />
											) : (
												stats.followings
											)}
										</Box>
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
							<Link href={'/article?articleCategory=CAREER'}>
								<Stack className={`menu-item ${isActive('/article', 'articleCategory', 'CAREER') ? 'active' : ''}`}>
									<Briefcase size={20} className="menu-icon" />
									<Box className="menu-text">Opportunities</Box>
									{articlesLoading ? (
										<Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 20, height: 16 }} />
									) : (
										<Box className="menu-count">{articlesCount}</Box>
									)}
								</Stack>
							</Link>
							<Link href={'/product'}>
								<Stack className={`menu-item ${isActive('/product') && !router.query.category ? 'active' : ''}`}>
									<ShoppingBag size={20} className="menu-icon" />
									<Box className="menu-text">Marketplace</Box>
									{productsLoading ? (
										<Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 20, height: 16 }} />
									) : (
										<Box className="menu-count">{productsCount}</Box>
									)}
								</Stack>
							</Link>
							<Stack className="menu-item " onClick={() => setComingSoonOpen(true)} sx={{ cursor: 'pointer' }}>
								<MessageSquare size={20} className="menu-icon" />
								<Box className="menu-text">Messages</Box>
								<Box className="menu-badge">Soon</Box>
							</Stack>
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

								<Link href={'/activity/favorites'}>
									<Stack className={`menu-item ${isActive('/activity/favorites') ? 'active' : ''}`}>
										<Heart size={20} className="menu-icon" />
										<Box className="menu-text">Favorites</Box>
									</Stack>
								</Link>

								<Link href={'/activity/history'}>
									<Stack className={`menu-item ${isActive('/activity/history') ? 'active' : ''}`}>
										<History size={20} className="menu-icon" />
										<Box className="menu-text">Recently Viewed</Box>
									</Stack>
								</Link>

								<Link href={'/activity/savedItems'}>
									<Stack className={`menu-item ${isActive('/activity/savedItems') ? 'active' : ''}`}>
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

								<Dialog
									open={logoutOpen}
									onClose={() => setLogoutOpen(false)}
									maxWidth="xs"
									fullWidth
									PaperProps={{
										sx: {
											borderRadius: '16px',
											boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
											overflow: 'hidden',
										},
									}}
								>
									{/* Content */}
									<DialogContent sx={{ px: 3, py: 3 }}>
										<Box
											sx={{
												fontSize: '14px',
												color: '#374151',
												lineHeight: 1.6,
											}}
										>
											Are you sure you want to log out?
											<br />
											You'll need to sign in again to access your account.
										</Box>
									</DialogContent>

									{/* Actions */}
									<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
										<Button
											fullWidth
											variant="outlined"
											onClick={() => setLogoutOpen(false)}
											sx={{
												borderRadius: '10px',
												textTransform: 'none',
												fontWeight: 600,
												borderColor: '#e5e7eb',
												color: '#374151',
												'&:hover': {
													backgroundColor: '#f9fafb',
													borderColor: '#d1d5db',
												},
											}}
										>
											Cancel
										</Button>

										<Button
											fullWidth
											variant="contained"
											onClick={handleLogout}
											sx={{
												borderRadius: '10px',
												textTransform: 'none',
												fontWeight: 700,
												background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
												boxShadow: '0 6px 20px rgba(239,68,68,0.35)',
												'&:hover': {
													background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
												},
											}}
										>
											Log out
										</Button>
									</DialogActions>
								</Dialog>

								<Snackbar open={comingSoonOpen} autoHideDuration={3000} onClose={() => setComingSoonOpen(false)}>
									<Alert severity="info" variant="filled">
										Messages feature is coming soon 🚀
									</Alert>
								</Snackbar>
							</>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default LeftSidebar;