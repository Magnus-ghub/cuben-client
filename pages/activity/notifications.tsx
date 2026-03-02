import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Button, CircularProgress, Avatar } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { GET_MY_NOTIFICATIONS } from '../../libs/apollo/user/query';
import { READ_ALL_NOTIFICATIONS, READ_NOTIFICATION } from '../../libs/apollo/user/mutation';
import { REACT_APP_API_URL } from '../../libs/config';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { useRouter } from 'next/router';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NotificationsPage: NextPage = () => {
	const router = useRouter();
	const { data, loading, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
		variables: {
			input: {
				page: 1,
				limit: 50,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		fetchPolicy: 'network-only',
	});

	const [readOne] = useMutation(READ_NOTIFICATION);
	const [readAll] = useMutation(READ_ALL_NOTIFICATIONS);

	const list = data?.getMyNotifications?.list || [];
	const unread = useMemo(
		() => list.filter((item: any) => item.notificationStatus === NotificationStatus.WAIT).length,
		[list],
	);

	const navigateByItem = (item: any) => {
		if (item.productId) {
			router.push(`/product/detail?id=${item.productId}`);
			return;
		}
		if (item.articleId) {
			router.push(`/article/detail?id=${item.articleId}`);
			return;
		}
		if (item.authorId) {
			router.push(`/member?memberId=${item.authorId}`);
			return;
		}
		router.push('/');
	};

	const handleReadOne = async (id: string) => {
		await readOne({ variables: { input: id } });
		await refetch();
	};

	const handleReadAll = async () => {
		await readAll();
		await refetch();
	};

	if (loading) {
		return (
			<Stack sx={{ width: '100%', minHeight: '40vh', alignItems: 'center', justifyContent: 'center' }}>
				<CircularProgress />
			</Stack>
		);
	}

	return (
		<Stack sx={{ width: '100%', p: 2, gap: 2 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Box sx={{ fontSize: 22, fontWeight: 700 }}>Notifications</Box>
				<Button disabled={unread === 0} onClick={handleReadAll} variant="outlined" sx={{ textTransform: 'none' }}>
					Mark all as read
				</Button>
			</Stack>

			{list.length === 0 ? (
				<Box sx={{ p: 3, border: '1px solid #e5e7eb', borderRadius: 2, background: '#fff' }}>No notifications yet.</Box>
			) : (
				<Stack sx={{ gap: 1 }}>
					{list.map((item: any) => {
						const isUnread = item.notificationStatus === NotificationStatus.WAIT;
						return (
							<Stack
								key={item._id}
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{
									p: 1.25,
									borderRadius: 2,
									border: isUnread ? '1px solid #c7d2fe' : '1px solid #e5e7eb',
									background: isUnread ? '#eef2ff' : '#fff',
									gap: 1,
								}}
							>
								<Stack direction="row" alignItems="center" gap={1.2} sx={{ minWidth: 0, flex: 1, cursor: 'pointer' }} onClick={() => navigateByItem(item)}>
									<Avatar
										src={item?.authorData?.memberImage ? `${REACT_APP_API_URL}/${item.authorData.memberImage}` : '/img/profile/defaultUser.svg'}
										sx={{ width: 38, height: 38 }}
									/>
									<Stack sx={{ minWidth: 0 }}>
										<Box sx={{ fontSize: 14, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
											{item.notificationTitle}
										</Box>
										{item.notificationDesc && (
											<Box sx={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
												{item.notificationDesc}
											</Box>
										)}
									</Stack>
								</Stack>
								{isUnread && (
									<Button size="small" variant="text" onClick={() => handleReadOne(item._id)} sx={{ textTransform: 'none' }}>
										Read
									</Button>
								)}
							</Stack>
						);
					})}
				</Stack>
			)}
		</Stack>
	);
};

export default withLayoutMain(NotificationsPage);
