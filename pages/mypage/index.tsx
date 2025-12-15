import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack, Box, Avatar, Badge } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useMutation, useReactiveVar } from '@apollo/client';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Messages } from '../../libs/config';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../libs/apollo/user/mutation';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import AddProduct from '../../libs/components/mypage/AddNewProduct';
import MyMenu from '../../libs/components/mypage/MyMenu';
import MyProducts from '../../libs/components/mypage/MyProducts';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MyArticles from '../../libs/components/mypage/MyArticles';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import Link from 'next/link';
import {
	User,
	Settings,
	Package,
	Heart,
	Clock,
	FileText,
	PenSquare,
	Users,
	UserPlus,
	LayoutDashboard,
	ShoppingBag,
	TrendingUp,
	Award,
	MessageSquare,
	Bell,
	Mail,
	Phone,
	MapPin,
	Edit,
	Crown,
} from 'lucide-react';

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

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

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

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});

			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
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

	// Menu items with icons
	const menuItems = [
		{
			id: 'myProfile',
			label: 'My Profile',
			icon: <User size={20} />,
			section: 'account',
		},
		{
			id: 'addProduct',
			label: 'Add Listing',
			icon: <PenSquare size={20} />,
			section: 'marketplace',
		},
		{
			id: 'myProducts',
			label: 'My Listings',
			icon: <Package size={20} />,
			section: 'marketplace',
		},
		{
			id: 'myFavorites',
			label: 'Favorites',
			icon: <Heart size={20} />,
			section: 'activity',
		},
		{
			id: 'recentlyVisited',
			label: 'Recently Viewed',
			icon: <Clock size={20} />,
			section: 'activity',
		},
		{
			id: 'writeArticle',
			label: 'Write Post',
			icon: <PenSquare size={20} />,
			section: 'community',
		},
		{
			id: 'myArticles',
			label: 'My Posts',
			icon: <FileText size={20} />,
			section: 'community',
		},
		{
			id: 'followers',
			label: 'Followers',
			icon: <Users size={20} />,
			section: 'social',
		},
		{
			id: 'followings',
			label: 'Following',
			icon: <UserPlus size={20} />,
			section: 'social',
		},
	];

	// Quick stats (mock data - replace with real data)
	const quickStats = [
		{ label: 'Posts', value: '24', icon: <FileText size={20} />, color: '#667eea' },
		{ label: 'Listings', value: '8', icon: <ShoppingBag size={20} />, color: '#10b981' },
		{ label: 'Followers', value: '125', icon: <Users size={20} />, color: '#f59e0b' },
		{ label: 'Reputation', value: '89', icon: <Award size={20} />, color: '#ec4899' },
	];

	if (device === 'mobile') {
		return <div>MY PAGE MOBILE</div>;
	}

	return (
		<Stack className={'mypage-container'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Box className={'page-header'}>
					<Box className={'header-content'}>
						<h1>My Dashboard</h1>
						<p>Manage your profile, posts, and listings</p>
					</Box>
					<Link href="/settings" style={{ textDecoration: 'none' }}>
						<Box className={'settings-btn'}>
							<Settings size={20} />
							<span>Settings</span>
						</Box>
					</Link>
				</Box>

				{/* Profile Card */}
				<Box className={'profile-banner'}>
					<Box className={'profile-background'}></Box>
					<Box className={'profile-content'}>
						<Box className={'profile-left'}>
							<Badge
								overlap="circular"
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								badgeContent={
									<Box className={'edit-badge'}>
										<Edit size={14} />
									</Box>
								}
							>
								<Avatar src={user?.memberImage || '/img/profile/defaultUser.svg'} className={'profile-avatar'} />
							</Badge>
							<Box className={'profile-info'}>
								<Box className={'name-badge'}>
									<h2>{user?.memberNick || 'User Name'}</h2>
									{user?.memberType === 'AGENT' && (
										<Box className={'verified-badge'}>
											<Crown size={16} />
										</Box>
									)}
								</Box>
								<p className={'username'}>@{user?.memberNick?.toLowerCase() || 'username'}</p>
								<Stack className={'user-meta'}>
									<Box className={'meta-item'}>
										<Mail size={16} />
										<span>{user?.memberEmail || 'email@example.com'}</span>
									</Box>
									<Box className={'meta-item'}>
										<Phone size={16} />
										<span>{user?.memberPhone || '+82 10-1234-5678'}</span>
									</Box>
								</Stack>
							</Box>
						</Box>

						{/* Quick Stats */}
						<Stack className={'quick-stats'}>
							{quickStats.map((stat, index) => (
								<Box key={index} className={'stat-item'} style={{ borderTopColor: stat.color }}>
									<Box className={'stat-icon'} style={{ background: `${stat.color}15`, color: stat.color }}>
										{stat.icon}
									</Box>
									<Box className={'stat-content'}>
										<h3>{stat.value}</h3>
										<p>{stat.label}</p>
									</Box>
								</Box>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Main Content Area */}
				<Stack className={'main-content'}>
					{/* Sidebar Menu */}
					<Box className={'sidebar-menu'}>
						<Box className={'menu-header'}>
							<LayoutDashboard size={20} />
							<h3>Navigation</h3>
						</Box>

						<Stack className={'menu-sections'}>
							{/* Account Section */}
							<Box className={'menu-section'}>
								<p className={'section-label'}>Account</p>
								{menuItems
									.filter((item) => item.section === 'account')
									.map((item) => (
										<Link
											key={item.id}
											href={`/mypage?category=${item.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Box className={`menu-item ${category === item.id ? 'active' : ''}`}>
												{item.icon}
												<span>{item.label}</span>
											</Box>
										</Link>
									))}
							</Box>

							{/* Marketplace Section */}
							<Box className={'menu-section'}>
								<p className={'section-label'}>Marketplace</p>
								{menuItems
									.filter((item) => item.section === 'marketplace')
									.map((item) => (
										<Link
											key={item.id}
											href={`/mypage?category=${item.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Box className={`menu-item ${category === item.id ? 'active' : ''}`}>
												{item.icon}
												<span>{item.label}</span>
											</Box>
										</Link>
									))}
							</Box>

							{/* Community Section */}
							<Box className={'menu-section'}>
								<p className={'section-label'}>Community</p>
								{menuItems
									.filter((item) => item.section === 'community')
									.map((item) => (
										<Link
											key={item.id}
											href={`/mypage?category=${item.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Box className={`menu-item ${category === item.id ? 'active' : ''}`}>
												{item.icon}
												<span>{item.label}</span>
											</Box>
										</Link>
									))}
							</Box>

							{/* Activity Section */}
							<Box className={'menu-section'}>
								<p className={'section-label'}>Activity</p>
								{menuItems
									.filter((item) => item.section === 'activity')
									.map((item) => (
										<Link
											key={item.id}
											href={`/mypage?category=${item.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Box className={`menu-item ${category === item.id ? 'active' : ''}`}>
												{item.icon}
												<span>{item.label}</span>
											</Box>
										</Link>
									))}
							</Box>

							{/* Social Section */}
							<Box className={'menu-section'}>
								<p className={'section-label'}>Social</p>
								{menuItems
									.filter((item) => item.section === 'social')
									.map((item) => (
										<Link
											key={item.id}
											href={`/mypage?category=${item.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Box className={`menu-item ${category === item.id ? 'active' : ''}`}>
												{item.icon}
												<span>{item.label}</span>
												{item.id === 'followers' && (
													<Badge badgeContent={12} color="error" className={'menu-badge'} />
												)}
											</Box>
										</Link>
									))}
							</Box>
						</Stack>
					</Box>

					{/* Content Area */}
					<Box className={'content-area'}>
						{category === 'addProduct' && <AddProduct />}
						{category === 'myProducts' && <MyProducts />}
						{category === 'myFavorites' && <MyFavorites />}
						{category === 'recentlyVisited' && <RecentlyVisited />}
						{category === 'myArticles' && <MyArticles />}
						{category === 'writeArticle' && <WriteArticle />}
						{category === 'myProfile' && <MyProfile />}
						{category === 'followers' && (
							<MemberFollowers
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								likeMemberHandler={likeMemberHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
							/>
						)}
						{category === 'followings' && (
							<MemberFollowings
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
								likeMemberHandler={likeMemberHandler}
								redirectToMemberPageHandler={redirectToMemberPageHandler}
							/>
						)}
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutMain(MyPage);