import { Box, MenuItem, Stack, Badge, Dialog, DialogContent, DialogActions, Alert } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';
import Menu, { MenuProps } from '@mui/material/Menu';
import Button from '@mui/material/Button';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { alpha, styled } from '@mui/material/styles';
import { CaretDown } from 'phosphor-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userVar, chatOpenVar } from '../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { REACT_APP_API_URL } from '../config';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { UnivoLogo } from './common/UnivoLogo';
import NotifDropdown from './NotifDropdown';
import { Logout } from '@mui/icons-material';

const Top: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const drop = Boolean(anchorEl2);
	const createMenuOpen = Boolean(createMenuAnchor);
	const chatOpen = useReactiveVar(chatOpenVar);
	const [imageError, setImageError] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [profileMenuAnchor, setProfileMenuAnchor] = useState<HTMLElement | null>(null);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		setImageError(false);
	}, [user?.memberImage]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const handleOpenChat = () => {
		chatOpenVar(!chatOpenVar());
	};

	const handleCreateMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
		setCreateMenuAnchor(e.currentTarget);
	};

	const handleCreateMenuClose = () => {
		setCreateMenuAnchor(null);
	};

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && searchQuery.trim()) {
			router.push({
				pathname: '/',
				query: { search: searchQuery.trim() },
			});
			setSearchQuery('');
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleImageError = () => {
		setImageError(true);
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

	const handleNotificationClick = (e: React.MouseEvent<HTMLElement>) => {
		if (!user?._id) return;
		setNotifAnchor(e.currentTarget);
		setNotifOpen((prev) => !prev);
	};

	const handleNotifClose = () => {
		setNotifOpen(false);
		setNotifAnchor(null);
	};

	const profileMenuOpen = Boolean(profileMenuAnchor);

	const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
		setProfileMenuAnchor(e.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setProfileMenuAnchor(null);
	};

	const handleMobileMenuNavigate = (path: string) => {
		router.push(path);
		handleProfileMenuClose();
	};

	const handleMobileLogout = async () => {
		try {
			await logOut();
			userVar(null);
			setLogoutDialogOpen(false);
			handleProfileMenuClose();
			window.location.href = '/';
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpenLogoutDialog = () => {
		handleProfileMenuClose();
		setLogoutDialogOpen(true);
	};

	const handleCloseLogoutDialog = () => {
		setLogoutDialogOpen(false);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 12,
			marginTop: theme.spacing(1),
			minWidth: 180,
			boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 2px rgba(0,0,0,0.05)',
			'& .MuiMenu-list': {
				padding: '8px',
			},
			'& .MuiMenuItem-root': {
				borderRadius: 8,
				padding: '10px 12px',
				margin: '2px 0',
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	useEffect(() => {
		console.log('Current user:', user);
		console.log('Member status:', user?.memberStatus);
	}, [user]);

	if (device === 'mobile') {
		return (
			<>
				<Stack className={'navbar'}>
					<Stack className={'navbar-main'}>
						<Stack
							className={'container'}
							direction={'row'}
							alignItems={'center'}
							justifyContent={'space-between'}
							sx={{ flexWrap: 'nowrap' }}
						>
						{/* Logo Section */}
						<Link href={'/'} style={{ textDecoration: 'none' }}>
							<Stack className="logo-section" direction={'row'} alignItems={'center'}>
								<Box component={'div'} className={'logo-box'}>
									<UnivoLogo />
								</Box>
								<Box component={'div'} className={'brand-name'}>
									<div className="brand-text">univo</div>
								</Box>
							</Stack>
						</Link>
						
						{/* Right Section */}
						<Box component={'div'} className={'actions-box'}>
							{/* Icons Section */}
							<Stack className="icons-section" direction={'row'} alignItems={'center'}>

								{/* ── 4. Notification Icon — dropdown bilan ── */}
								{user?._id && (
									<Box
										component="div"
										onClick={handleNotificationClick}
										className={`icon-wrapper${notifOpen ? ' notif-icon-active' : ''}`}
										sx={{
											cursor: 'pointer',
											'&:hover': { transform: 'scale(1.1)' },
										}}
									>
										<Badge badgeContent={unreadCount || undefined} color="error">
											<NotificationsOutlinedIcon sx={{ fontSize: 24, color: notifOpen ? '#667eea' : '#6b7280' }} />
										</Badge>
									</Box>
								)}

								{/* Language Selector */}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} weight="fill" />}
									sx={{
										minWidth: 'auto',
										padding: '6px 10px',
										borderRadius: '8px',
										'&:hover': { background: '#f3f4f6' },
									}}
								>
									<Box component={'div'} className={'flag'}>
										<img
											src={`/img/flag/lang${lang}.png`}
											alt={`${lang} flag`}
											style={{ width: 24, height: 17, borderRadius: 2 }}
											onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
												e.currentTarget.src = '/img/flag/langen.png';
											}}
										/>
									</Box>
								</Button>
								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} alt={'USA Flag'} />
										{t('english')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ko">
										<img className="img-flag" src={'/img/flag/langko.png'} alt={'Korean Flag'} />
										{t('korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="uz">
										<img className="img-flag" src={'/img/flag/languz.png'} alt={'Uzbek Flag'} />
										{t('uzbek')}
									</MenuItem>
								</StyledMenu>
							</Stack>

							{/* User Profile or Login */}
							{user?._id ? (
								<>
									<Box className={'login-user'} onClick={handleProfileMenuOpen} sx={{ cursor: 'pointer' }}>
										<img src={getUserImageSrc()} alt="user profile" onError={handleImageError} />
									</Box>
									<StyledMenu anchorEl={profileMenuAnchor} open={profileMenuOpen} onClose={handleProfileMenuClose}>
										<MenuItem onClick={handleOpenLogoutDialog}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											{t('logout')}
										</MenuItem>
									</StyledMenu>

									<Dialog
										open={logoutDialogOpen}
										onClose={handleCloseLogoutDialog}
										maxWidth="xs"
										fullWidth
										PaperProps={{
											sx: {
												borderRadius: '16px',
												overflow: 'hidden',
											},
										}}
									>
										<DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
											<Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
												{t('logoutConfirmTitle')}
											</Alert>
											<Box sx={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>{t('logoutConfirmDesc')}</Box>
										</DialogContent>
										<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
											<Button
												fullWidth
												variant="outlined"
												onClick={handleCloseLogoutDialog}
												sx={{
													borderRadius: '10px',
													textTransform: 'none',
													fontWeight: 600,
													borderColor: '#e5e7eb',
													color: '#374151',
												}}
											>
												{t('cancel')}
											</Button>

											<Button
												fullWidth
												variant="contained"
												onClick={handleMobileLogout}
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
								</>
							) : (
								<Link href={'/account/join'} style={{ textDecoration: 'none' }}>
									<Button
										variant="outlined"
										className="join-btn"
										sx={{
											borderRadius: '24px',
											padding: '8px 24px',
											textTransform: 'none',
											fontWeight: 600,
											fontSize: '14px',
											borderColor: '#667eea',
											color: '#667eea',
											'&:hover': {
												borderColor: '#5568d3',
												background: 'rgba(102, 126, 234, 0.05)',
											},
										}}
									>
										{t('loginRegister')}
									</Button>
								</Link>
							)}
						</Box>
					</Stack>
					</Stack>
				</Stack>

				{notifOpen && <Box className="notif-backdrop" onClick={handleNotifClose} />}

				<NotifDropdown
					open={notifOpen}
					onClose={handleNotifClose}
					anchorEl={notifAnchor}
					onUnreadChange={setUnreadCount}
				/>
			</>
		);
	}

	return (
		<>
			<Stack className={'navbar'}>
				<Stack className={'navbar-main'}>
					<Stack className={'container'}>
						{/* Logo Section */}
						<Link href={'/'} style={{ textDecoration: 'none' }}>
							<Stack className="logo-section">
								<Box component={'div'} className={'logo-box'}>
									<UnivoLogo />
								</Box>
								<Box component={'div'} className={'brand-name'}>
									<div className="brand-text">univo</div>
									<div className="univ-text">부산외국어대학교</div>
								</Box>
							</Stack>
						</Link>

						{/* Search Box */}
						<Box component={'div'} className={'search-box'}>
							<SearchIcon className="search-icon" />
							<input
								type="text"
								placeholder={t('search_placeholder')}
								value={searchQuery}
								onChange={handleSearchChange}
								onKeyDown={handleSearch}
							/>
						</Box>

						{/* Right Section */}
						<Box component={'div'} className={'actions-box'}>
							{/* Create Button with Dropdown */}
							{user?._id && (
								<>
									<Button
										variant="contained"
										className="create-btn"
										startIcon={<AddCircleOutlineIcon />}
										onClick={handleCreateMenuOpen}
										sx={{
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: '#fff',
											borderRadius: '24px',
											padding: '8px 20px',
											textTransform: 'none',
											fontWeight: 600,
											fontSize: '14px',
											boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
											'&:hover': {
												background: 'linear-gradient(135deg, #5568d3 0%, #6a4091 100%)',
												boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
											},
										}}
									>
										{t('create')}
									</Button>
									<StyledMenu anchorEl={createMenuAnchor} open={createMenuOpen} onClose={handleCreateMenuClose}>
										<MenuItem
											onClick={() => {
												router.push('/create/writePost');
												handleCreateMenuClose();
											}}
										>
											📝 {t('write_post')}
										</MenuItem>
										<MenuItem
											onClick={() => {
												router.push('/create/listItem');
												handleCreateMenuClose();
											}}
										>
											🛒 {t('sell_item')}
										</MenuItem>
										{user?.memberType === 'AGENT' && (
											<MenuItem
												onClick={() => {
													router.push('/create/postJob');
													handleCreateMenuClose();
												}}
											>
												💼 {t('post_job')}
											</MenuItem>
										)}
									</StyledMenu>
								</>
							)}

							{/* Icons Section */}
							<Stack className="icons-section">
								{/* Chat Icon */}
								<Box
									component="div"
									onClick={handleOpenChat}
									className="icon-wrapper"
									sx={{
										cursor: 'pointer',
										'&:hover': { transform: 'scale(1.1)' },
									}}
								>
									<MarkUnreadChatAltIcon sx={{ fontSize: 24, color: '#6b7280' }} />
								</Box>

								{/* ── 4. Notification Icon — dropdown bilan ── */}
								{user?._id && (
									<Box
										component="div"
										onClick={handleNotificationClick}
										className={`icon-wrapper${notifOpen ? ' notif-icon-active' : ''}`}
										sx={{
											cursor: 'pointer',
											'&:hover': { transform: 'scale(1.1)' },
										}}
									>
										<Badge badgeContent={unreadCount || undefined} color="error">
											<NotificationsOutlinedIcon sx={{ fontSize: 24, color: notifOpen ? '#667eea' : '#6b7280' }} />
										</Badge>
									</Box>
								)}

								{/* Language Selector */}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} weight="fill" />}
									sx={{
										minWidth: 'auto',
										padding: '6px 10px',
										borderRadius: '8px',
										'&:hover': { background: '#f3f4f6' },
									}}
								>
									<Box component={'div'} className={'flag'}>
										<img
											src={`/img/flag/lang${lang}.png`}
											alt={`${lang} flag`}
											style={{ width: 24, height: 17, borderRadius: 2 }}
											onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
												e.currentTarget.src = '/img/flag/langen.png';
											}}
										/>
									</Box>
								</Button>
								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} alt={'USA Flag'} />
										{t('english')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ko">
										<img className="img-flag" src={'/img/flag/langko.png'} alt={'Korean Flag'} />
										{t('korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="uz">
										<img className="img-flag" src={'/img/flag/languz.png'} alt={'Uzbek Flag'} />
										{t('uzbek')}
									</MenuItem>
								</StyledMenu>
							</Stack>

							{/* User Profile or Login */}
							{user?._id ? (
								<Link href="/mypage" style={{ textDecoration: 'none' }}>
									<Box className={'login-user'}>
										<img src={getUserImageSrc()} alt="user profile" onError={handleImageError} />
									</Box>
								</Link>
							) : (
								<Link href={'/account/join'} style={{ textDecoration: 'none' }}>
									<Button
										variant="outlined"
										className="join-btn"
										sx={{
											borderRadius: '24px',
											padding: '8px 24px',
											textTransform: 'none',
											fontWeight: 600,
											fontSize: '14px',
											borderColor: '#667eea',
											color: '#667eea',
											'&:hover': {
												borderColor: '#5568d3',
												background: 'rgba(102, 126, 234, 0.05)',
											},
										}}
									>
										{t('loginRegister')}
									</Button>
								</Link>
							)}
						</Box>
					</Stack>
				</Stack>
			</Stack>

			{/* ── 5. Backdrop + Dropdown ── */}
			{notifOpen && <Box className="notif-backdrop" onClick={handleNotifClose} />}

			<NotifDropdown
				open={notifOpen}
				onClose={handleNotifClose}
				anchorEl={notifAnchor}
				onUnreadChange={setUnreadCount}
			/>
		</>
	);
};

export default Top;
