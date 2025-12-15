import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { Box, Button, Checkbox, FormControlLabel, Stack, InputAdornment, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	User,
	Lock,
	Phone,
	Eye,
	EyeOff,
	ArrowRight,
	Mail,
	CheckCircle,
	Shield,
	Users,
	Zap,
	GraduationCap,
	Chrome,
	Github,
} from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [rememberMe, setRememberMe] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
		// Reset input when switching views
		setInput({ nick: '', password: '', phone: '', type: 'USER' });
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (loginView) {
				doLogin();
			} else {
				doSignUp();
			}
		}
	};

	// Features for the right side
	const features = [
		{
			icon: <Users size={24} />,
			title: 'Connect with Students',
			description: 'Join a vibrant community of university students',
		},
		{
			icon: <GraduationCap size={24} />,
			title: 'Academic Resources',
			description: 'Share notes, find study groups, get help',
		},
		{
			icon: <Shield size={24} />,
			title: 'Safe & Secure',
			description: 'Verified university email addresses only',
		},
		{
			icon: <Zap size={24} />,
			title: 'All in One Platform',
			description: 'Community, marketplace, and job board',
		},
	];

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	}

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'join-card'}>
					{/* Left Side - Form */}
					<Stack className={'form-section'}>
						{/* Logo */}
						<Box className={'logo-section'}>
							<Box className={'logo'}>
								<svg width="40" height="40" viewBox="0 0 100 100" fill="none">
									<defs>
										<linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
											<stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
											<stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
										</linearGradient>
									</defs>
									<path
										d="M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z"
										fill="none"
										stroke="url(#logoGradient)"
										strokeWidth="6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path d="M 50 15 L 50 50" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
									<path d="M 15 35 L 50 50" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
									<path d="M 85 35 L 50 50" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
								</svg>
								<span>cuben</span>
							</Box>
							<p className={'university-name'}>부산외국어대학교</p>
						</Box>

						{/* Header */}
						<Box className={'form-header'}>
							<h1>{loginView ? 'Welcome Back!' : 'Join Cuben'}</h1>
							<p>
								{loginView
									? 'Sign in to access your university community'
									: 'Create your account and connect with students'}
							</p>
						</Box>

						{/* Social Login Buttons */}
						<Stack className={'social-buttons'}>
							<Button className={'social-btn google'}>
								<Chrome size={20} />
								<span>Continue with Google</span>
							</Button>
							<Button className={'social-btn github'}>
								<Github size={20} />
								<span>Continue with GitHub</span>
							</Button>
						</Stack>

						<Box className={'divider'}>
							<span>or {loginView ? 'sign in' : 'sign up'} with email</span>
						</Box>

						{/* Form Inputs */}
						<Stack className={'input-form'}>
							<Box className={'input-group'}>
								<label>
									<User size={18} />
									Nickname
								</label>
								<input
									type="text"
									placeholder="Enter your nickname"
									value={input.nick}
									onChange={(e) => handleInput('nick', e.target.value)}
									onKeyDown={handleKeyPress}
								/>
							</Box>

							{!loginView && (
								<Box className={'input-group'}>
									<label>
										<Phone size={18} />
										Phone Number
									</label>
									<input
										type="tel"
										placeholder="010-1234-5678"
										value={input.phone}
										onChange={(e) => handleInput('phone', e.target.value)}
										onKeyDown={handleKeyPress}
									/>
								</Box>
							)}

							<Box className={'input-group'}>
								<label>
									<Lock size={18} />
									Password
								</label>
								<Box className={'password-input'}>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										value={input.password}
										onChange={(e) => handleInput('password', e.target.value)}
										onKeyDown={handleKeyPress}
									/>
									<IconButton onClick={() => setShowPassword(!showPassword)} className={'password-toggle'}>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</IconButton>
								</Box>
							</Box>

							{!loginView && (
								<Box className={'account-type'}>
									<span className={'type-label'}>I want to register as:</span>
									<Stack className={'type-options'}>
										<Box
											className={`type-option ${input.type === 'USER' ? 'active' : ''}`}
											onClick={() => handleInput('type', 'USER')}
										>
											<User size={20} />
											<span>Student</span>
											{input.type === 'USER' && <CheckCircle size={18} className={'check-icon'} />}
										</Box>
										<Box
											className={`type-option ${input.type === 'AGENT' ? 'active' : ''}`}
											onClick={() => handleInput('type', 'AGENT')}
										>
											<GraduationCap size={20} />
											<span>Faculty</span>
											{input.type === 'AGENT' && <CheckCircle size={18} className={'check-icon'} />}
										</Box>
									</Stack>
								</Box>
							)}

							{loginView && (
								<Box className={'remember-forgot'}>
									<FormControlLabel
										control={
											<Checkbox
												checked={rememberMe}
												onChange={(e) => setRememberMe(e.target.checked)}
												size="small"
											/>
										}
										label="Remember me"
										className={'remember-checkbox'}
									/>
									<a href="/forgot-password" className={'forgot-link'}>
										Forgot password?
									</a>
								</Box>
							)}

							<Button
								className={'submit-btn'}
								disabled={
									loginView
										? input.nick === '' || input.password === ''
										: input.nick === '' || input.password === '' || input.phone === ''
								}
								onClick={loginView ? doLogin : doSignUp}
							>
								{loginView ? 'Sign In' : 'Create Account'}
								<ArrowRight size={20} />
							</Button>
						</Stack>

						{/* Toggle View */}
						<Box className={'toggle-view'}>
							{loginView ? (
								<p>
									Don't have an account?{' '}
									<span onClick={() => viewChangeHandler(false)}>Sign up for free</span>
								</p>
							) : (
								<p>
									Already have an account? <span onClick={() => viewChangeHandler(true)}>Sign in</span>
								</p>
							)}
						</Box>
					</Stack>

					{/* Right Side - Features */}
					<Stack className={'info-section'}>
						<Box className={'info-content'}>
							<Box className={'info-header'}>
								<Zap size={32} className={'zap-icon'} />
								<h2>Welcome to Cuben</h2>
								<p>Your all-in-one university community platform</p>
							</Box>

							<Stack className={'features-list'}>
								{features.map((feature, index) => (
									<Box key={index} className={'feature-item'}>
										<Box className={'feature-icon'}>{feature.icon}</Box>
										<Box className={'feature-text'}>
											<h3>{feature.title}</h3>
											<p>{feature.description}</p>
										</Box>
									</Box>
								))}
							</Stack>

							<Box className={'info-footer'}>
								<p>
									By signing up, you agree to our{' '}
									<a href="/terms" target="_blank">
										Terms of Service
									</a>{' '}
									and{' '}
									<a href="/privacy" target="_blank">
										Privacy Policy
									</a>
								</p>
							</Box>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(Join);