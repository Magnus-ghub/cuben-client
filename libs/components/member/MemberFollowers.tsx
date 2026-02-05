import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Avatar, Chip, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Follower } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import { Users, UserCheck, Heart, Search, Filter } from 'lucide-react';
import { GET_MEMBER_FOLLOWERS } from '../../apollo/user/query';
import { T } from '../../types/common';

interface MemberFollowersProps {
	initialInput?: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowers = (props: MemberFollowersProps) => {
	const { initialInput, subscribeHandler, unsubscribeHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);

	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(
		initialInput || {
			page: 1,
			limit: 10,
			search: {
				followingId: '',
			},
		},
	);

	/** APOLLO REQUESTS **/
	// 41-58 qatorlarni o'zgartiring:
	const {
		loading: getMemberFollowersLoading,
		data: getMemberFollowersData,
		error: getMemberFollowersError,
		refetch: getMemberFollowersRefetch,
	} = useQuery(GET_MEMBER_FOLLOWERS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followingId,
		notifyOnNetworkStatusChange: true,
	});

	// useEffect qo'shing (60-qatordan keyin):
	useEffect(() => {
		if (getMemberFollowersData?.getMemberFollowers) {
			console.log('GET_MEMBER_FOLLOWERS Response:', getMemberFollowersData);
			setMemberFollowers(getMemberFollowersData.getMemberFollowers.list || []);
			setTotal(getMemberFollowersData.getMemberFollowers.metaCounter?.[0]?.total || 0);
		}
	}, [getMemberFollowersData]);

	useEffect(() => {
		if (getMemberFollowersError) {
			console.error('GET_MEMBER_FOLLOWERS Error:', getMemberFollowersError);
		}
	}, [getMemberFollowersError]);

	/** LIFECYCLES **/
	useEffect(() => {
		const memberId = router.query.memberId as string;

		if (memberId) {
			console.log('Setting followingId from router:', memberId);
			setFollowInquiry((prev) => ({
				...prev,
				page: 1,
				search: { followingId: memberId },
			}));
		} else if (user?._id) {
			console.log('Setting followingId from user:', user._id);
			setFollowInquiry((prev) => ({
				...prev,
				page: 1,
				search: { followingId: user._id },
			}));
		}
	}, [router.query.memberId, user?._id]);

	useEffect(() => {
		if (followInquiry?.search?.followingId) {
			console.log('Refetching with inquiry:', followInquiry);
			getMemberFollowersRefetch({ input: followInquiry });
		}
	}, [followInquiry]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry((prev) => ({ ...prev, page: value }));
	};

	// Loading state
	if (getMemberFollowersLoading) {
		return (
			<Box className="modern-followers-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading followers...</p>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>FOLLOWERS MOBILE</div>;
	}

	return (
		<Box className="modern-followers-container">
			{/* Header Section */}
			<Stack className="followers-header">
				<Box className="header-left">
					<Box className="title-icon">
						<Users size={24} />
					</Box>
					<Box>
						<h2 className="section-title">Followers</h2>
						<p className="section-subtitle">People who follow you</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<Users size={16} />} label={`${total} Followers`} className="total-chip" />
				</Box>
			</Stack>

			{/* Followers List */}
			<Stack className="followers-list">
				{memberFollowers?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<Users size={64} />
						</Box>
						<h3>No Followers Yet</h3>
						<p>When people follow you, they'll appear here</p>
					</Box>
				) : (
					<>
						{memberFollowers.map((follower: Follower) => {
							const imagePath = follower?.followerData?.memberImage
								? `${REACT_APP_API_URL}/${follower?.followerData?.memberImage}`
								: '/img/profile/defaultUser.svg';

							return (
								<Box key={follower._id} className="follower-card">
									{/* Left Section - Profile Info */}
									<Box
										className="profile-section"
										onClick={() => redirectToMemberPageHandler(follower?.followerData?._id)}
									>
										<Avatar src={imagePath} alt={follower?.followerData?.memberNick} className="follower-avatar" />
										<Box className="profile-info">
											<h4 className="follower-name">{follower?.followerData?.memberNick}</h4>
											<p className="follower-username">@{follower?.followerData?.memberNick?.toLowerCase()}</p>
										</Box>
									</Box>

									{/* Middle Section - Stats */}
									<Stack className="stats-section" flexDirection={'row'}>
										<Box className="stat-item">
											<Users size={18} />
											<Box className="stat-info">
												<span className="stat-label">Followers</span>
												<span className="stat-value">{follower?.followerData?.memberFollowers || 0}</span>
											</Box>
										</Box>
										<Box className="stat-item">
											<UserCheck size={18} />
											<Box className="stat-info">
												<span className="stat-label">Following</span>
												<span className="stat-value">{follower?.followerData?.memberFollowings || 0}</span>
											</Box>
										</Box>
									</Stack>

									{/* Right Section - Action Button */}
									{user?._id !== follower?.followerId && (
										<Box className="action-section">
											{follower?.meFollowed?.[0]?.myFollowing ? (
												<Button
													variant="outlined"
													className="unfollow-button"
													startIcon={<UserCheck size={18} />}
													onClick={() =>
														unsubscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
													}
												>
													Following
												</Button>
											) : (
												<Button
													variant="contained"
													className="follow-button"
													startIcon={<Users size={18} />}
													onClick={() =>
														subscribeHandler(follower?.followerData?._id, getMemberFollowersRefetch, followInquiry)
													}
												>
													Follow Back
												</Button>
											)}
										</Box>
									)}
								</Box>
							);
						})}
					</>
				)}
			</Stack>

			{/* Pagination */}
			{memberFollowers.length > 0 && (
				<Stack className="pagination-section">
					<Pagination
						page={followInquiry.page}
						count={Math.ceil(total / followInquiry.limit)}
						onChange={paginationHandler}
						shape="rounded"
						color="primary"
						size="large"
						className="pagination-control"
					/>
				</Stack>
			)}
		</Box>
	);
};

MemberFollowers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			followingId: '',
		},
	},
};

export default MemberFollowers;
