import { Box, MenuItem, Stack } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Menu, { MenuProps } from '@mui/material/Menu';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material/styles';
import { CaretDown } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userVar, chatOpenVar } from '../apollo/store'; 
import { useReactiveVar } from '@apollo/client';
import { REACT_APP_API_URL } from '../config';
import { getJwtToken, updateUserInfo } from '../auth';

// Cuben Logo SVG Component
const CubenLogo: React.FC = () => (
	<svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" style={{ stopColor: '#5DDBF4', stopOpacity: 1 }} />
				<stop offset="50%" style={{ stopColor: '#7B9FF5', stopOpacity: 1 }} />
				<stop offset="100%" style={{ stopColor: '#9B7FED', stopOpacity: 1 }} />
			</linearGradient>
		</defs>

		<path
			d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z"
			fill="none"
			stroke="url(#cubeGradient)"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>

		<path d="M 50 15 L 50 50" stroke="url(#cubeGradient)" strokeWidth="8" strokeLinecap="round" />

		<path d="M 15 35 L 50 50" stroke="url(#cubeGradient)" strokeWidth="8" strokeLinecap="round" />

		<path d="M 85 35 L 50 50" stroke="url(#cubeGradient)" strokeWidth="8" strokeLinecap="round" />
	</svg>
);

const Top: React.FC = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	const [bgColor, setBgColor] = useState<boolean>(false);
	

	// ✅ YANGI: Global chat state
	const chatOpen = useReactiveVar(chatOpenVar);

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
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

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

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	// ✅ ASOSIY O'ZGARISH: Chat ni ochish/yopish
	const handleOpenChat = () => {
		console.log('🔥 Chat button bosildi!');
		console.log('📊 Hozirgi chatOpen holati:', chatOpenVar());
		chatOpenVar(!chatOpenVar());
		console.log('✅ Yangi chatOpen holati:', chatOpenVar());
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
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
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device === 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{'Home'}</div>
				</Link>
				<Link href={'/property'}>
					<div>{'Properties'}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {'Agents'} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {'Community'} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {'CS'} </div>
				</Link>
			</Stack>
		);
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
						<input type="text" placeholder="Cuben에서 검색..." />
					</Box>

					<Box component={'div'} className={'user-box'}>
						<div className={'lan-box'}>
							{/* ✅ CHAT BUTTON - Global state bilan ishlaydi */}
							<Box 
								component="div" 
								onClick={handleOpenChat}
								sx={{ 
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									'&:hover': {
										opacity: 0.7
									}
								}}
							>
								<MarkUnreadChatAltIcon className={'notification-icon'} />
							</Box>
							
							{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
							<Button
								disableRipple
								className="btn-lang"
								onClick={langClick}
								endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
							>
								<Box component={'div'} className={'flag'}>
									<img
										src={`/img/flag/lang${lang}.png`}
										alt={`${lang} flag`}
										onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
											e.currentTarget.src = '/img/flag/langen.png';
										}}
									/>
								</Box>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
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
						</div>
						{user?._id ? (
							<>
								<div
									className={'login-user'}
								>
									<img
										src={
											user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
										}
										alt="user profile"
									/>
								</div>
							</>
						) : (
							<Link href={'/account/join'}>
								<div className={'join-box'}>
									<AccountCircleOutlinedIcon />
									<span>
										{t('Login')} / {t('Register')}
									</span>
								</div>
							</Link>
						)}
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Top;