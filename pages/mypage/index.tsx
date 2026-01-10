import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack, Box, Avatar, Badge, Chip } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../libs/apollo/user/mutation';
import { GET_MEMBER } from '../../libs/apollo/user/query'; 
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyProducts from '../../libs/components/mypage/MyProducts';
import MyPosts from '../../libs/components/mypage/MyPosts';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import Link from 'next/link';
import {
	User,
	Settings,
	Package,
	FileText,
	Users,
	UserPlus,
	ShoppingBag,
	Award,
	Edit,
	Crown,
	Mail,
	Phone,
	Eye,
	TrendingUp,
	Activity,
} from 'lucide-react';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	
	// State for stats (from backend)
	const [stats, setStats] = useState({
		posts: 0,
		products: 0,
		followers: 0,
		followings: 0,
		views: 0,
		likes: 0,
	});

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		variables: { input: user?._id || '' },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		onCompleted: (data: T) => {
			const member = data?.getMember;
			if (member) {
				setStats({
					posts: member.memberPosts || 0,
					products: member.memberProducts || 0,
					followers: member.memberFollowers || 0,
					followings: member.memberFollowings || 0,
					views: member.memberViews || 0,
					likes: member.memberLikes || 0,
				});
			}
		},
		onError: (error) => {
			sweetErrorHandling(error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	useEffect(() => {
		if (user?._id) {
			getMemberRefetch({ input: user._id });
		}
	}, [user?._id]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	// Top Navigation Tabs
	const navigationTabs = [
		{
			id: 'myProfile',
			label: 'Profile',
			icon: <User size={18} />,
			count: null,
		},
		{
			id: 'myProducts',
			label: 'Listings',
			icon: <Package size={18} />,
			count: stats.products,
		},
		{
			id: 'myArticles',
			label: 'Posts',
			icon: <FileText size={18} />,
			count: stats.posts,
		},
		{
			id: 'followers',
			label: 'Followers',
			icon: <Users size={18} />,
			count: stats.followers,
		},
		{
			id: 'followings',
			label: 'Following',
			icon: <UserPlus size={18} />,
			count: stats.followings,
		},
	];

	// Quick stats for profile banner
	const quickStats = [
		{ 
			label: 'Total Views', 
			value: stats.views.toLocaleString(), 
			icon: <Eye size={22} />, 
			color: '#667eea',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		},
		{ 
			label: 'Active Listings', 
			value: stats.products.toString(), 
			icon: <ShoppingBag size={22} />, 
			color: '#10b981',
			gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
		},
		{ 
			label: 'Total Posts', 
			value: stats.posts.toString(), 
			icon: <FileText size={22} />, 
			color: '#f59e0b',
			gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
		},
		{ 
			label: 'Engagement', 
			value: `${stats.likes}%`, 
			icon: <TrendingUp size={22} />, 
			color: '#ec4899',
			gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
		},
	];

	if (device === 'mobile') {
		return <div>MY PAGE MOBILE</div>;
	}

	return (
		<Stack className={'mypage-container'}>
			<Stack className={'container'}>
				{/* Hero Profile Section */}
				<Box className={'hero-section'}>
					{/* Background Pattern */}
					<Box className={'hero-background'}>
						<Box className={'pattern-overlay'}></Box>
					</Box>

					{/* Profile Content */}
					<Box className={'hero-content'}>
						<Box className={'profile-section'}>
							<Badge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								badgeContent={
									<Box className={'edit-badge'}>
										<Edit size={16} />
									</Box>
								}
							>
								<Avatar 
									src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'} 
									className={'hero-avatar'} 
								/>
							</Badge>

							<Box className={'profile-details'}>
								<Box className={'name-section'}>
									<Box className={'name-row'}>
										<h1>{user?.memberNick || 'User Name'}</h1>
										{user?.memberType === 'AGENT' && (
											<Chip 
												icon={<Crown size={14} />}
												label="Verified Agent"
												className={'verified-chip'}
											/>
										)}
									</Box>
									<p className={'username'}>@{user?.memberNick?.toLowerCase() || 'username'}</p>
								</Box>

								<Stack className={'contact-info'}>
									<Box className={'contact-item'}>
										<Mail size={16} />
										<span>{user?.memberPhone || 'phone@example.com'}</span> {/* memberPhone instead of email */}
									</Box>
									<Box className={'contact-item'}>
										<Phone size={16} />
										<span>{user?.memberPhone || '+82 10-1234-5678'}</span>
									</Box>
								</Stack>
							</Box>
						</Box>

						<Link href="/settings" style={{ textDecoration: 'none' }}>
							<Box className={'settings-button'}>
								<Settings size={20} />
								<span>Settings</span>
							</Box>
						</Link>
					</Box>

					{/* Quick Stats Cards */}
					<Box className={'stats-grid'}>
						{quickStats.map((stat, index) => (
							<Box 
								key={index} 
								className={'stat-card'}
								style={{ 
									background: stat.gradient,
								}}
							>
								<Box className={'stat-icon-wrapper'}>
									{stat.icon}
								</Box>
								<Box className={'stat-info'}>
									<h3>{stat.value}</h3>
									<p>{stat.label}</p>
								</Box>
								<Box className={'stat-decoration'}>
									<Activity size={60} opacity={0.1} />
								</Box>
							</Box>
						))}
					</Box>
				</Box>

				{/* Top Navigation Tabs */}
				<Box className={'navigation-tabs'}>
					<Box className={'tabs-container'}>
						{navigationTabs.map((tab) => (
							<Link
								key={tab.id}
								href={`/mypage?category=${tab.id}`}
								style={{ textDecoration: 'none' }}
							>
								<Box className={`nav-tab ${category === tab.id ? 'active' : ''}`}>
									<Box className={'tab-content'}>
										{tab.icon}
										<span>{tab.label}</span>
										{tab.count !== null && tab.count > 0 && (
											<Chip 
												label={tab.count} 
												size="small"
												className={'tab-badge'}
											/>
										)}
									</Box>
									{category === tab.id && <Box className={'active-indicator'} />}
								</Box>
							</Link>
						))}
					</Box>
				</Box>

				{/* Main Content Area */}
				<Box className={'content-wrapper'}>
					<Box className={'content-area'}>
						{category === 'myProducts' && <MyProducts />}
						{category === 'myArticles' && <MyPosts />}
						{category === 'myProfile' && <MyProfile />}
						{category === 'followers' && (
							<MemberFollowers
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
							/>
						)}
						{category === 'followings' && (
							<MemberFollowings
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
							/>
						)}
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(MyPage);