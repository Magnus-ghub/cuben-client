import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Avatar, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Follower } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import { Users, UserCheck, Heart, TrendingUp, Search, Filter } from 'lucide-react';

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
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(
		initialInput || {
			page: 1,
			limit: 10,
			search: {
				followingId: '',
			},
		}
	);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	// TODO: Add your GraphQL query here
	// const { data, loading, refetch } = useQuery(GET_FOLLOWERS, {
	//   variables: { input: followInquiry },
	// });

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.memberId) {
			setFollowInquiry({ ...followInquiry, search: { followingId: router.query.memberId as string } });
		} else {
			setFollowInquiry({ ...followInquiry, search: { followingId: user?._id || '' } });
		}
	}, [router.query.memberId, user?._id]);

	useEffect(() => {
		// TODO: Fetch followers data
		// if (data?.getFollowers) {
		//   setMemberFollowers(data.getFollowers.list);
		//   setTotal(data.getFollowers.metaCounter[0]?.total || 0);
		// }
	}, [followInquiry]);

	/** HANDLERS **/
	const paginationHandler = (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value);
	};

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
					<Chip
						icon={<Users size={16} />}
						label={`${total} Followers`}
						className="total-chip"
					/>
				</Box>
			</Stack>

			{/* Search & Filter Bar */}
			<Stack className="search-filter-bar">
				<Box className="search-box">
					<Search size={20} />
					<input
						type="text"
						placeholder="Search followers..."
						value={searchText}
						onChange={handleSearchChange}
					/>
				</Box>
				<Button className="filter-button" startIcon={<Filter size={18} />}>
					Filter
				</Button>
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
										<Avatar
											src={imagePath}
											alt={follower?.followerData?.memberNick}
											className="follower-avatar"
										/>
										<Box className="profile-info">
											<h4 className="follower-name">{follower?.followerData?.memberNick}</h4>
											<p className="follower-username">@{follower?.followerData?.memberNick?.toLowerCase()}</p>
										</Box>
									</Box>

									{/* Middle Section - Stats */}
									<Stack className="stats-section">
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
										<Box className="stat-item">
											<Heart 
												size={18} 
												fill={follower?.meLiked?.[0]?.myFavorite ? '#ec4899' : 'none'}
												color={follower?.meLiked?.[0]?.myFavorite ? '#ec4899' : 'currentColor'}
											/>
											<Box className="stat-info">
												<span className="stat-label">Likes</span>
												<span className="stat-value">{follower?.followerData?.memberLikes || 0}</span>
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
													onClick={() => unsubscribeHandler(follower?.followerData?._id, null, followInquiry)}
												>
													Following
												</Button>
											) : (
												<Button
													variant="contained"
													className="follow-button"
													startIcon={<Users size={18} />}
													onClick={() => subscribeHandler(follower?.followerData?._id, null, followInquiry)}
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

export default MemberFollowers;