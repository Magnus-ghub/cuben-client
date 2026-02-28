import { Direction } from '../../enums/common.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface FMemberMini {
	_id: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
}

export interface FMetaCounter {
	total: number;
}

export interface FNotification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	productId?: string;
	articleId?: string;
	createdAt: string;
	updatedAt: string;
	authorData?: FMemberMini;
	receiverData?: FMemberMini;
}

export interface FNotifications {
	list: FNotification[];
	metaCounter?: FMetaCounter[];
}

export interface FNotificationStats {
	modifiedCount: number;
}

export interface FNotificationInput {
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	receiverId: string;
	productId?: string;
	articleId?: string;
}

export interface FNotificationUpdate {
	_id: string;
	notificationStatus?: NotificationStatus;
	notificationTitle?: string;
	notificationDesc?: string;
}

export interface FNotificationsSearch {
	notificationStatus?: NotificationStatus;
	notificationType?: NotificationType;
	notificationGroup?: NotificationGroup;
}

export interface FNotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FNotificationsSearch;
}

export interface FAllNotificationsSearch {
	notificationStatus?: NotificationStatus;
	notificationType?: NotificationType;
	notificationGroup?: NotificationGroup;
	authorId?: string;
	receiverId?: string;
}

export interface FAllNotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FAllNotificationsSearch;
}

export interface CreateNotificationVars {
	input: FNotificationInput;
}

export interface CreateNotificationRes {
	createNotification: FNotification;
}

export interface ReadNotificationVars {
	input: string;
}

export interface ReadNotificationRes {
	readNotification: FNotification;
}

export interface ReadAllNotificationsRes {
	readAllNotifications: FNotificationStats;
}

export interface RemoveNotificationVars {
	input: string;
}

export interface RemoveNotificationRes {
	removeNotification: FNotification;
}

export interface UpdateNotificationByAdminVars {
	input: FNotificationUpdate;
}

export interface UpdateNotificationByAdminRes {
	updateNotificationByAdmin: FNotification;
}

export interface RemoveNotificationByAdminVars {
	input: string;
}

export interface RemoveNotificationByAdminRes {
	removeNotificationByAdmin: FNotification;
}

export interface GetNotificationVars {
	input: string;
}

export interface GetNotificationRes {
	getNotification: FNotification;
}

export interface GetMyNotificationsVars {
	input: FNotificationsInquiry;
}

export interface GetMyNotificationsRes {
	getMyNotifications: FNotifications;
}

export interface GetAllNotificationsByAdminVars {
	input: FAllNotificationsInquiry;
}

export interface GetAllNotificationsByAdminRes {
	getAllNotificationsByAdmin: FNotifications;
}
