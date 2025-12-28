import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Pagination, Stack, Avatar, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../apollo/store';
import { Users, UserCheck, Heart, UserPlus, Search, Filter } from 'lucide-react';

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
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(
		initialInput || {
			page: 1,
			limit: 10,
			search: {
				followerId: '',
			},
		}
	);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const [searchText, setSearchText] = useState<string>('');
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	// TODO: Add your GraphQL query here
	// const { data, loading, refetch } = useQuery(GET_FOLLOWINGS, {
	//   variables: { input: followInquiry },
	// });

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.memberId) {
			setFollowInquiry({ ...followInquiry, search: { followerId: router.query.memberId as string } });
		} else {
			setFollowInquiry({ ...followInquiry, search: { followerId: user?._id || '' } });
		}
	}, [router.query.memberId, user?._id]);

	useEffect(() => {
		// TODO: Fetch followings data
		// if (data?.getFollowings) {
		//   setMemberFollowings(data.getFollowings.list);
		//   setTotal(data.getFollowings.metaCounter[0]?.total || 0);
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
					<Chip
						icon={<UserPlus size={16} />}
						label={`${total} Following`}
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
						placeholder="Search following..."
						value={searchText}
						onChange={handleSearchChange}
					/>
				</Box>
				<Button className="filter-button" startIcon={<Filter size={18} />}>
					Filter
				</Button>
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
										<Avatar
											src={imagePath}
											alt={following?.followingData?.memberNick}
											className="follower-avatar"
										/>
										<Box className="profile-info">
											<h4 className="follower-name">{following?.followingData?.memberNick}</h4>
											<p className="follower-username">@{following?.followingData?.memberNick?.toLowerCase()}</p>
										</Box>
									</Box>

									{/* Middle Section - Stats */}
									<Stack className="stats-section">
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
										<Box className="stat-item">
											<Heart 
												size={18} 
												fill={following?.meLiked?.[0]?.myFavorite ? '#ec4899' : 'none'}
												color={following?.meLiked?.[0]?.myFavorite ? '#ec4899' : 'currentColor'}
											/>
											<Box className="stat-info">
												<span className="stat-label">Likes</span>
												<span className="stat-value">{following?.followingData?.memberLikes || 0}</span>
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
													onClick={() => unsubscribeHandler(following?.followingData?._id, null, followInquiry)}
												>
													Following
												</Button>
											) : (
												<Button
													variant="contained"
													className="follow-button"
													startIcon={<Users size={18} />}
													onClick={() => subscribeHandler(following?.followingData?._id, null, followInquiry)}
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

export default MemberFollowings;