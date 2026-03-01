import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Avatar, CircularProgress, Divider } from '@mui/material';
import {
	Bell, Heart, MessageCircle, UserPlus,
	ShoppingBag, Briefcase, Calendar,
	CheckCheck, X, Info,
} from 'lucide-react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { REACT_APP_API_URL } from '../config';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GET_MY_NOTIFICATIONS } from '../apollo/user/query';
import { READ_NOTIFICATION, READ_ALL_NOTIFICATIONS } from '../apollo/user/mutation';

// ── Relative time ─────────────────────────────────────────────
const timeAgo = (dateStr: string): string => {
	const diff = Date.now() - new Date(dateStr).getTime();
	const s = Math.floor(diff / 1000);
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	const d = Math.floor(h / 24);
	const w = Math.floor(d / 7);
	if (s < 60)  return 'just now';
	if (m < 60)  return `${m}m ago`;
	if (h < 24)  return `${h}h ago`;
	if (d < 7)   return `${d}d ago`;
	if (w < 4)   return `${w}w ago`;
	return `${Math.floor(d / 30)}mo ago`;
};

// ── Enums (match backend exactly) ────────────────────────────
export enum NotificationType {
	LIKE    = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW  = 'FOLLOW',
	PRODUCT = 'PRODUCT',
	JOB     = 'JOB',
	EVENT   = 'EVENT',
	SYSTEM  = 'SYSTEM',
}

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}

export enum NotificationGroup {
	PRODUCT = 'PRODUCT',
	POST    = 'POST',
	ARTICLE = 'ARTICLE',
	MEMBER  = 'MEMBER',
	SYSTEM  = 'SYSTEM',
}

// ── Type from GraphQL schema ──────────────────────────────────
export interface INotification {
	_id:                 string;
	notificationType:    NotificationType;
	notificationStatus:  NotificationStatus;
	notificationGroup:   NotificationGroup;
	notificationTitle:   string;
	notificationDesc?:   string;
	authorId?:           string;
	receiverId:          string;
	productId?:          string;
	articleId?:          string;
	createdAt:           string;
	updatedAt:           string;
	authorData?: {
		_id:           string;
		memberNick:    string;
		memberFullName?: string;
		memberImage?:  string;
	};
}

// ── Props ────────────────────────────────────────────────────
interface NotifDropdownProps {
	open:            boolean;
	onClose:         () => void;
	anchorEl:        HTMLElement | null;
	onUnreadChange:  (count: number) => void;
}

// ── Icon config per notification type ────────────────────────
const typeIcon = (type: NotificationType) => {
	const map: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string }> = {
		[NotificationType.LIKE]:    { icon: <Heart         size={13} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)'    },
		[NotificationType.COMMENT]: { icon: <MessageCircle size={13} />, color: '#667eea', bg: 'rgba(102,126,234,0.1)'  },
		[NotificationType.FOLLOW]:  { icon: <UserPlus      size={13} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)'   },
		[NotificationType.PRODUCT]: { icon: <ShoppingBag   size={13} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'   },
		[NotificationType.JOB]:     { icon: <Briefcase     size={13} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'   },
		[NotificationType.EVENT]:   { icon: <Calendar      size={13} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)'   },
		[NotificationType.SYSTEM]:  { icon: <Info          size={13} />, color: '#6b7280', bg: 'rgba(107,114,128,0.1)'  },
	};
	return map[type] ?? map[NotificationType.SYSTEM];
};

// ── Target href builder ───────────────────────────────────────
const buildHref = (n: INotification): string => {
	if (n.productId) return `/product/${n.productId}`;
	if (n.articleId) return `/article/${n.articleId}`;
	if (n.notificationType === NotificationType.FOLLOW) return '/mypage';
	return '/';
};

// ── Component ─────────────────────────────────────────────────
const NotifDropdown: React.FC<NotifDropdownProps> = ({
	open, onClose, anchorEl, onUnreadChange,
}) => {
	const user     = useReactiveVar(userVar);
	const { t }    = useTranslation('common');
	const router   = useRouter();
	const panelRef = useRef<HTMLDivElement>(null);

	const [tab,      setTab]      = useState<'all' | 'unread'>('all');
	const [items,    setItems]    = useState<INotification[]>([]);
	const [total,    setTotal]    = useState(0);
	const [page]                  = useState(1);

	// ── Apollo ───────────────────────────────────────────────
	const { data, loading, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
		variables: { input: { page, limit: 20, search: {} } },
		skip: !open || !user?._id,
		fetchPolicy: 'network-only',
		onCompleted: (data) => {
			const list = data?.getMyNotifications?.list ?? [];
			const count = data?.getMyNotifications?.metaCounter?.[0]?.total ?? 0;
			setItems(list);
			setTotal(count);
		},
	});

	const [readOne]  = useMutation(READ_NOTIFICATION);
	const [readAll]  = useMutation(READ_ALL_NOTIFICATIONS);

	// ── Unread count → badge ─────────────────────────────────
	const unread = items.filter((n) => n.notificationStatus === NotificationStatus.WAIT).length;

	useEffect(() => { onUnreadChange(unread); }, [unread]);

	// ── Refetch on open ──────────────────────────────────────
	useEffect(() => {
		if (open && user?._id) refetch();
	}, [open]);

	// ── Outside click close ──────────────────────────────────
	useEffect(() => {
		if (!open) return;
		const handle = (e: MouseEvent) => {
			if (
				panelRef.current && !panelRef.current.contains(e.target as Node) &&
				anchorEl && !anchorEl.contains(e.target as Node)
			) onClose();
		};
		document.addEventListener('mousedown', handle);
		return () => document.removeEventListener('mousedown', handle);
	}, [open, anchorEl, onClose]);

	// ── Close on route change ─────────────────────────────────
	useEffect(() => { if (open) onClose(); }, [router.pathname]);

	// ── Handlers ─────────────────────────────────────────────
	const handleReadOne = async (id: string) => {
		// Optimistic update
		setItems((prev) =>
			prev.map((n) =>
				n._id === id ? { ...n, notificationStatus: NotificationStatus.READ } : n
			)
		);
		try {
			await readOne({ variables: { input: id } });
		} catch (e) {
			// rollback on error
			refetch();
		}
	};

	const handleReadAll = async () => {
		// Optimistic update
		setItems((prev) =>
			prev.map((n) => ({ ...n, notificationStatus: NotificationStatus.READ }))
		);
		try {
			await readAll();
		} catch (e) {
			refetch();
		}
	};

	// ── Displayed list ────────────────────────────────────────
	const displayed = tab === 'unread'
		? items.filter((n) => n.notificationStatus === NotificationStatus.WAIT)
		: items;

	if (!open) return null;

	return (
		<Box className="notif-dropdown" ref={panelRef}>

			{/* ── Header ── */}
			<Stack className="notif-dropdown__header">
				<Box className="notif-dropdown__title">
					<Bell size={16} />
					{t('notifications') || 'Notifications'}
					{unread > 0 && (
						<Box className="notif-dropdown__badge">{unread}</Box>
					)}
				</Box>
				<Stack direction="row" alignItems="center" gap={0.5}>
					{unread > 0 && (
						<Box
							className="notif-dropdown__mark-all"
							onClick={handleReadAll}
							title="Mark all as read"
						>
							<CheckCheck size={15} />
						</Box>
					)}
					<Box className="notif-dropdown__close" onClick={onClose}>
						<X size={15} />
					</Box>
				</Stack>
			</Stack>

			{/* ── Tabs ── */}
			<Stack className="notif-dropdown__tabs">
				<Box
					className={`notif-dropdown__tab${tab === 'all' ? ' active' : ''}`}
					onClick={() => setTab('all')}
				>
					{t('all') || 'All'}
					<span>{items.length}</span>
				</Box>
				<Box
					className={`notif-dropdown__tab${tab === 'unread' ? ' active' : ''}`}
					onClick={() => setTab('unread')}
				>
					{t('unread') || 'Unread'}
					{unread > 0 && <span className="dot">{unread}</span>}
				</Box>
			</Stack>

			{/* ── Body ── */}
			<Box className="notif-dropdown__body">

				{loading ? (
					<Stack className="notif-dropdown__loading">
						<CircularProgress size={26} sx={{ color: '#667eea' }} />
					</Stack>

				) : displayed.length === 0 ? (
					<Stack className="notif-dropdown__empty">
						<Box className="notif-dropdown__empty-icon">
							<Bell size={30} strokeWidth={1.2} />
						</Box>
						<Box className="notif-dropdown__empty-title">
							{tab === 'unread'
								? "You're all caught up!"
								: (t('noNotifications') || 'No notifications yet')}
						</Box>
						<Box className="notif-dropdown__empty-sub">
							{tab === 'unread'
								? 'All notifications have been read'
								: "When someone likes or comments on your posts, you'll see it here"}
						</Box>
					</Stack>

				) : (
					<Stack className="notif-dropdown__list">
						{displayed.map((n) => {
							const meta    = typeIcon(n.notificationType);
							const isUnread = n.notificationStatus === NotificationStatus.WAIT;
							const href    = buildHref(n);
							const imgSrc  = n.authorData?.memberImage
								? `${REACT_APP_API_URL}/${n.authorData.memberImage}`
								: '/img/profile/defaultUser.svg';

							return (
								<Link
									key={n._id}
									href={href}
									style={{ textDecoration: 'none' }}
									onClick={() => {
										if (isUnread) handleReadOne(n._id);
										onClose();
									}}
								>
									<Stack className={`notif-item${isUnread ? ' unread' : ' read'}`}>
										{/* Unread dot */}
										{isUnread && <Box className="notif-item__dot" />}

										{/* Avatar + type icon */}
										<Box className="notif-item__avatar-wrap">
											<Avatar
												src={imgSrc}
												alt={n.authorData?.memberNick || 'User'}
												sx={{ width: 40, height: 40 }}
											/>
											<Box
												className="notif-item__type-icon"
												style={{ color: meta.color, background: meta.bg }}
											>
												{meta.icon}
											</Box>
										</Box>

										{/* Content */}
										<Box className="notif-item__content">
											<Box className="notif-item__msg">
												{/* notificationTitle — backend tomonidan to'liq matn yuboriladi */}
												{n.notificationTitle}
											</Box>
											{n.notificationDesc && (
												<Box className="notif-item__desc">
													{n.notificationDesc}
												</Box>
											)}
											<Box className="notif-item__time">
												{timeAgo(n.createdAt)}
											</Box>
										</Box>
									</Stack>
								</Link>
							);
						})}
					</Stack>
				)}
			</Box>

			{/* ── Footer ── */}
			{items.length > 0 && (
				<Box className="notif-dropdown__footer">
					<Box
						className="notif-dropdown__view-all"
						onClick={() => { router.push('/notifications'); onClose(); }}
					>
						{t('viewAllNotifications') || 'View all notifications'}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default NotifDropdown;