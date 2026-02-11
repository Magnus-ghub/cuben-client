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
import { useTranslation } from 'next-i18next';
import React, { useState, useEffect } from 'react';
import { userVar } from '../apollo/store';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../config';
import { Snackbar, Alert } from '@mui/material';
import { GET_ARTICLES, GET_MEMBER, GET_PRODUCTS } from '../apollo/user/query';
import { sweetErrorHandling } from '../sweetAlert';

const LeftSidebar = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [comingSoonOpen, setComingSoonOpen] = useState(false);
	const [imageError, setImageError] = useState(false);

	const [stats, setStats] = useState({
		followers: 0,
		followings: 0,
	});

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

	useEffect(() => {
		if (getMemberData?.getMember) {
			const member = getMemberData.getMember;
			setStats({
				followers: member.memberFollowers || 0,
				followings: member.memberFollowings || 0,
			});
		}
	}, [getMemberData]);

	useEffect(() => {
		if (getMemberError) {
			sweetErrorHandling(getMemberError);
		}
	}, [getMemberError]);

	const { data: articlesData, loading: articlesLoading } = useQuery(GET_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 1,
				search: {},
			},
		},
		fetchPolicy: 'cache-and-network',
		// skip: false - doim load qiladi
	});

	const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit: 1,
				search: {},
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const articlesCount = articlesData?.getArticles?.metaCounter[0]?.total || 0;
	const productsCount = productsData?.getProducts?.metaCounter[0]?.total || 0;

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

	const isActive = (path: string, queryKey?: string, queryValue?: string) => {
		const baseActive = router.pathname === path;
		if (queryKey && queryValue) {
			return baseActive && router.query[queryKey] === queryValue;
		}
		return baseActive;
	};

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
										<Box className="stat-label">{t('followers')}</Box>
									</Stack>
									<Stack className="stat-item">
										<Box className="stat-number">
											{getMemberLoading ? (
												<Skeleton variant="text" sx={{ fontSize: '1.5rem', width: 40, height: 24 }} />
											) : (
												stats.followings
											)}
										</Box>
										<Box className="stat-label">{t('following')}</Box>
									</Stack>
								</Stack>
							</Stack>
						</Link>
					)}

					{/* Sidebar Content */}
					<Stack className="sidebar-content">
						{/* HOME Section - Hamma userlar uchun count bilan */}
						<Stack className="sidebar-section">
							<Box className="section-title">🏠 {t('home')}</Box>
							<Link href={'/'}>
								<Stack className={`menu-item ${isActive('/') ? 'active' : ''}`}>
									<LayoutList size={20} className="menu-icon" />
									<Box className="menu-text">{t('feed')}</Box>
								</Stack>
							</Link>
							<Link href={'/article?articleCategory=CAREER'}>
								<Stack className={`menu-item ${isActive('/article', 'articleCategory', 'CAREER') ? 'active' : ''}`}>
									<Briefcase size={20} className="menu-icon" />
									<Box className="menu-text">{t('opportunities')}</Box>
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
									<Box className="menu-text">{t('marketplace')}</Box>
									{productsLoading ? (
										<Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 20, height: 16 }} />
									) : (
										<Box className="menu-count">{productsCount}</Box>
									)}
								</Stack>
							</Link>
							<Stack className="menu-item " onClick={() => setComingSoonOpen(true)} sx={{ cursor: 'pointer' }}>
								<MessageSquare size={20} className="menu-icon" />
								<Box className="menu-text">{t('messages')}</Box>
								<Box className="menu-badge">Soon</Box>
							</Stack>
						</Stack>

						{/* MY ACTIVITY Section - Faqat login qilgan userlar uchun */}
						{user?._id && (
							<Stack className="sidebar-section">
								<Box className="section-title">⚡ {t('my_Activity')}</Box>

								<Link href={'/mypage'}>
									<Stack className={`menu-item ${isActive('/mypage') ? 'active' : ''}`}>
										<GraduationCap size={20} className="menu-icon" />
										<Box className="menu-text">{t('profile')}</Box>
									</Stack>
								</Link>

								<Link href={'/activity/favorites'}>
									<Stack className={`menu-item ${isActive('/activity/favorites') ? 'active' : ''}`}>
										<Heart size={20} className="menu-icon" />
										<Box className="menu-text">{t('favorites')}</Box>
									</Stack>
								</Link>

								<Link href={'/activity/history'}>
									<Stack className={`menu-item ${isActive('/activity/history') ? 'active' : ''}`}>
										<History size={20} className="menu-icon" />
										<Box className="menu-text">{t('recently_viewed')}</Box>
									</Stack>
								</Link>

								<Link href={'/activity/savedItems'}>
									<Stack className={`menu-item ${isActive('/activity/savedItems') ? 'active' : ''}`}>
										<BookmarkIcon size={20} className="menu-icon" />
										<Box className="menu-text">{t('saved_items')}</Box>
									</Stack>
								</Link>
							</Stack>
						)}

						{/* TOOLS Section - Hamma userlar uchun */}
						<Stack className="sidebar-section">
							<Box className="section-title">🛠️ {t('tools')}</Box>

							<Link href={'/calendar'}>
								<Stack className={`menu-item ${isActive('/calendar') ? 'active' : ''}`}>
									<Calendar size={20} className="menu-icon" />
									<Box className="menu-text">{t('calendar')}</Box>
								</Stack>
							</Link>

							<Link href={'/notes'}>
								<Stack className={`menu-item ${isActive('/notes') ? 'active' : ''}`}>
									<Notebook size={20} className="menu-icon" />
									<Box className="menu-text">{t('notes')}</Box>
								</Stack>
							</Link>
						</Stack>
					</Stack>

					{/* Bottom Section */}
					<Stack className="sidebar-bottom">
						<Link href="/cs">
							<Stack className="bottom-item">
								<HelpCircle size={20} className="menu-icon" />
								<Box>{t('helpSupport')}</Box>
							</Stack>
						</Link>
						<Link href="/about">
							<Stack className="bottom-item">
								<InfoIcon size={20} className="menu-icon" />
								<Box>{t('about')}</Box>
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
									<Box>{t('logout')}</Box>
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
											{t('logoutConfirmTitle')}
											<br />
											{t('logoutConfirmDesc')}
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
											{t('cancel')}
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
											{t('logout')}
										</Button>
									</DialogActions>
								</Dialog>

								<Snackbar open={comingSoonOpen} autoHideDuration={3000} onClose={() => setComingSoonOpen(false)}>
									<Alert severity="info" variant="filled">
										{t('messagesComingSoon')}🚀
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