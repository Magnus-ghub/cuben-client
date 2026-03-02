import React, { useMemo } from 'react';
import { Stack, Box, Chip, CircularProgress } from '@mui/material';
import { Calendar, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../apollo/user/query';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

const Notice = () => {
	const { data, loading, error } = useQuery(GET_NOTICES, {
		variables: {
			input: {
				page: 1,
				limit: 30,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		fetchPolicy: 'network-only',
	});

	const announcements = useMemo(() => {
		const list = data?.getNotices?.list || [];
		return list.filter((notice: any) => notice.noticeStatus === NoticeStatus.ACTIVE);
	}, [data]);

	const getPriorityClass = (category: NoticeCategory | string) => {
		switch (category) {
			case NoticeCategory.INQUIRY:
				return 'priority-high';
			case NoticeCategory.TERMS:
				return 'priority-medium';
			default:
				return 'priority-low';
		}
	};

	const getTypeIcon = (category: NoticeCategory | string) => {
		switch (category) {
			case NoticeCategory.FAQ:
				return <Star size={16} />;
			case NoticeCategory.TERMS:
				return <TrendingUp size={16} />;
			case NoticeCategory.INQUIRY:
				return <AlertCircle size={16} />;
			default:
				return <Calendar size={16} />;
		}
	};

	if (loading) {
		return (
			<Stack className={'notice-content'} sx={{ alignItems: 'center', py: 6 }}>
				<CircularProgress size={32} />
			</Stack>
		);
	}

	if (error) {
		return (
			<Stack className={'notice-content'}>
				<Box className={'section-header'}>
					<h2>Latest Announcements</h2>
					<p>Failed to load notices. Please try again.</p>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className={'notice-content'}>
			<Box className={'section-header'}>
				<h2>Latest Announcements</h2>
				<p>Stay updated with the latest news and updates from Univo</p>
			</Box>

			<Stack className={'announcements-list'}>
				{announcements.length === 0 ? (
					<Box className={'announcement-card priority-low'}>
						<Box className={'announcement-header'}>
							<Box className={'left-side'}>
								<Box className={'announcement-icon'}>📭</Box>
								<Box className={'announcement-info'}>
									<Box className={'title-row'}>
										<h3>No active announcements</h3>
									</Box>
									<p className={'description'}>New notices will appear here.</p>
								</Box>
							</Box>
						</Box>
					</Box>
				) : (
					announcements.map((announcement: any) => (
						<Box
							key={announcement._id}
							className={`announcement-card ${getPriorityClass(announcement.noticeCategory)}`}
						>
							<Box className={'announcement-header'}>
								<Box className={'left-side'}>
									<Box className={'announcement-icon'}>
										{announcement.noticeCategory === NoticeCategory.FAQ
											? '❓'
											: announcement.noticeCategory === NoticeCategory.TERMS
												? '📘'
												: '📢'}
									</Box>
									<Box className={'announcement-info'}>
										<Box className={'title-row'}>
											<h3>{announcement.noticeTitle}</h3>
											<Chip
												icon={getTypeIcon(announcement.noticeCategory)}
												label={announcement.noticeCategory}
												size="small"
												className={`type-badge ${String(announcement.noticeCategory || '').toLowerCase()}`}
											/>
										</Box>
										<p className={'description'}>{announcement.noticeContent}</p>
									</Box>
								</Box>
								<Box className={'right-side'}>
									<Box className={'date-badge'}>
										<Calendar size={16} />
										<span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
									</Box>
								</Box>
							</Box>
						</Box>
					))
				)}
			</Stack>
		</Stack>
	);
};

export default Notice;
