import { Box, MenuItem, Stack, Badge, Menu as MuiMenu } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Menu, { MenuProps } from '@mui/material/Menu';
import Button from '@mui/material/Button';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { alpha, styled } from '@mui/material/styles';
import { CaretDown } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userVar, chatOpenVar } from '../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { REACT_APP_API_URL } from '../config';
import { getJwtToken, updateUserInfo } from '../auth';
import { Snackbar, Alert } from '@mui/material';

// Cuben Logo SVG Component
const CubenLogo: React.FC = () => (
	<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const Top: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const createMenuOpen = Boolean(createMenuAnchor);
	const chatOpen = useReactiveVar(chatOpenVar);
	const [notificationCount] = useState();
	const [imageError, setImageError] = useState(false);
	const [notificationComingSoonOpen, setNotificationComingSoonOpen] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const storedLocale = localStorage.getItem('locale');
		if (storedLocale === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(storedLocale);
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// Reset image error when user changes
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

	const handleNotificationClick = () => {
		setNotificationComingSoonOpen(true);
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

	if (device === 'mobile') {
		return <Stack className={'top'}></Stack>;
	}

	return (
		<Stack className={'navbar'}>
			<Stack className={'navbar-main'}>
				<Stack className={'container'}>
					{/* Logo Section */}
					<Link href={'/'} style={{ textDecoration: 'none' }}>
						<Stack className="logo-section">
							<Box component={'div'} className={'logo-box'}>
								<CubenLogo />
							</Box>
							<Box component={'div'} className={'brand-name'}>
								<div className="brand-text">cuben</div>
								<div className="univ-text">부산외국어대학교</div>
							</Box>
						</Stack>
					</Link>

					{/* Search Box */}
					<Box component={'div'} className={'search-box'}>
						<SearchIcon className="search-icon" />
						<input type="text" placeholder="Search posts, jobs, items, or students..." />
					</Box>

					{/* Right Section */}
					<Box component={'div'} className={'actions-box'}>
						{/* Create Button with Dropdown - Faqat login qilgan userlar uchun */}
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
									Create
								</Button>
								<StyledMenu anchorEl={createMenuAnchor} open={createMenuOpen} onClose={handleCreateMenuClose}>
									<MenuItem
										onClick={() => {
											router.push('/create/writePost');
											handleCreateMenuClose();
										}}
									>
										📝 Write a Post
									</MenuItem>
									<MenuItem
										onClick={() => {
											router.push('/create/listItem');
											handleCreateMenuClose();
										}}
									>
										🛒 List an Item
									</MenuItem>
									{/* <MenuItem
										onClick={() => {
											router.push('/jobs/create');
											handleCreateMenuClose();
										}}
									>
										💼 Post a Job
									</MenuItem>
									<MenuItem
										onClick={() => {
											router.push('/events/create');
											handleCreateMenuClose();
										}}
									>
										📅 Create Event
									</MenuItem> */}
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
									'&:hover': {
										transform: 'scale(1.1)',
									},
								}}
							>
								<MarkUnreadChatAltIcon sx={{ fontSize: 24, color: '#6b7280' }} />
							</Box>

							{/* Notification Icon - Faqat login qilgan userlar uchun */}
							{user?._id && (
								<Box
									component="div"
									onClick={handleNotificationClick}
									className="icon-wrapper"
									sx={{
										cursor: 'pointer',
										'&:hover': {
											transform: 'scale(1.1)',
										},
									}}
								>
									<Badge badgeContent={notificationCount} color="error">
										<NotificationsOutlinedIcon sx={{ fontSize: 24, color: '#6b7280' }} />
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
									'&:hover': {
										background: '#f3f4f6',
									},
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
									{t('English')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="kr">
									<img className="img-flag" src={'/img/flag/langkr.png'} alt={'Korean Flag'} />
									{t('Korean')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="ru">
									<img className="img-flag" src={'/img/flag/langru.png'} alt={'Russian Flag'} />
									{t('Russian')}
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
									Login / Register
								</Button>
							</Link>
						)}
					</Box>
				</Stack>
			</Stack>

			{/* Snackbar for Notification Coming Soon */}
			<Snackbar
				open={notificationComingSoonOpen}
				autoHideDuration={3000}
				onClose={() => setNotificationComingSoonOpen(false)}
			>
				<Alert severity="info" variant="filled">
					Notifications feature is coming soon 🔔
				</Alert>
			</Snackbar>
		</Stack>
	);
};

export default Top;