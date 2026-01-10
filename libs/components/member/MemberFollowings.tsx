import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Avatar, Chip, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import { Users, UserCheck, Heart, UserPlus } from 'lucide-react';
import { GET_MEMBER_FOLLOWINGS } from '../../apollo/user/query';
import { T } from '../../types/common';

interface MemberFollowingsProps {
	initialInput?: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
	const { initialInput, subscribeHandler, unsubscribeHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	
	// Default follow inquiry with proper initialization
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(
		initialInput || {
			page: 1,
			limit: 10,
			search: {
				followerId: '',
			},
		}
	);

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowingsLoading,
		data: getMemberFollowingsData,
		error: getMemberFollowingsError,
		refetch: getMemberFollowingsRefetch,
	} = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followerId, // Skip if no followerId
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('GET_MEMBER_FOLLOWINGS Response:', data); // Debugging
			if (data?.getMemberFollowings) {
				setMemberFollowings(data.getMemberFollowings.list || []);
				setTotal(data.getMemberFollowings.metaCounter?.[0]?.total || 0);
			}
		},
		onError: (error) => {
			console.error('GET_MEMBER_FOLLOWINGS Error:', error);
		},
	});

	/** LIFECYCLES **/
	// Set followerId based on router query or logged in user
	useEffect(() => {
		const memberId = router.query.memberId as string;
		
		if (memberId) {
			// If viewing another member's page, use their ID
			console.log('Setting followerId from router:', memberId);
			setFollowInquiry((prev) => ({
				...prev,
				page: 1, // Reset to page 1
				search: { followerId: memberId },
			}));
		} else if (user?._id) {
			// If on own page, use logged in user's ID
			console.log('Setting followerId from user:', user._id);
			setFollowInquiry((prev) => ({
				...prev,
				page: 1, // Reset to page 1
				search: { followerId: user._id },
			}));
		}
	}, [router.query.memberId, user?._id]);

	// Refetch when followInquiry changes
	useEffect(() => {
		if (followInquiry?.search?.followerId) {
			console.log('Refetching with inquiry:', followInquiry);
			getMemberFollowingsRefetch({ input: followInquiry });
		}
	}, [followInquiry]);

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry((prev) => ({ ...prev, page: value }));
	};

	// Loading state
	if (getMemberFollowingsLoading) {
		return (
			<Box className="modern-followers-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading followings...</p>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>FOLLOWINGS MOBILE</div>;
	}

	return (
		<Box className="modern-followers-container">
			{/* Header Section */}
			<Stack className="followers-header">
				<Box className="header-left">
					<Box className="title-icon">
						<UserPlus size={24} />
					</Box>
					<Box>
						<h2 className="section-title">Following</h2>
						<p className="section-subtitle">People you follow</p>
					</Box>
				</Box>
				<Box className="header-right">
					<Chip icon={<UserPlus size={16} />} label={`${total} Following`} className="total-chip" />
				</Box>
			</Stack>

			{/* Followings List */}
			<Stack className="followers-list">
				{memberFollowings?.length === 0 ? (
					<Box className="empty-state">
						<Box className="empty-icon">
							<UserPlus size={64} />
						</Box>
						<h3>Not Following Anyone Yet</h3>
						<p>Start following people to see them here</p>
					</Box>
				) : (
					<>
						{memberFollowings.map((following: Following) => {
							const imagePath = following?.followingData?.memberImage
								? `${REACT_APP_API_URL}/${following?.followingData?.memberImage}`
								: '/img/profile/defaultUser.svg';

							return (
								<Box key={following._id} className="follower-card">
									{/* Left Section - Profile Info */}
									<Box
										className="profile-section"
										onClick={() => redirectToMemberPageHandler(following?.followingData?._id)}
									>
										<Avatar src={imagePath} alt={following?.followingData?.memberNick} className="follower-avatar" />
										<Box className="profile-info">
											<h4 className="follower-name">{following?.followingData?.memberNick}</h4>
											<p className="follower-username">@{following?.followingData?.memberNick?.toLowerCase()}</p>
										</Box>
									</Box>

									{/* Middle Section - Stats */}
									<Stack className="stats-section" flexDirection={'row'}>
										<Box className="stat-item">
											<Users size={18} />
											<Box className="stat-info">
												<span className="stat-label">Followers</span>
												<span className="stat-value">{following?.followingData?.memberFollowers || 0}</span>
											</Box>
										</Box>
										<Box className="stat-item">
											<UserCheck size={18} />
											<Box className="stat-info">
												<span className="stat-label">Following</span>
												<span className="stat-value">{following?.followingData?.memberFollowings || 0}</span>
											</Box>
										</Box>
									</Stack>

									{/* Right Section - Action Button */}
									{user?._id !== following?.followingId && (
										<Box className="action-section">
											{following?.meFollowed?.[0]?.myFollowing ? (
												<Button
													variant="outlined"
													className="unfollow-button"
													startIcon={<UserCheck size={18} />}
													onClick={() =>
														unsubscribeHandler(
															following?.followingData?._id,
															getMemberFollowingsRefetch,
															followInquiry
														)
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
														subscribeHandler(
															following?.followingData?._id,
															getMemberFollowingsRefetch,
															followInquiry
														)
													}
												>
													Follow
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
			{memberFollowings.length > 0 && (
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

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			followerId: '',
		},
	},
};

export default MemberFollowings;