import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

export interface FMemberMini {
	_id: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
	memberType?: string;
	memberStatus?: string;
}

export interface FMetaCounter {
	total: number;
}

export interface FNotice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: string;
	updatedAt: string;
	memberData?: FMemberMini;
}

export interface FNotices {
	list: FNotice[];
	metaCounter?: FMetaCounter[];
}

export interface FNoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
}

export interface FNoticeUpdate {
	_id: string;
	noticeStatus?: NoticeStatus;
	noticeCategory?: NoticeCategory;
	noticeTitle?: string;
	noticeContent?: string;
}

export interface FNoticesSearch {
	noticeCategory?: NoticeCategory;
	text?: string;
}

export interface FNoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FNoticesSearch;
}

export interface FAllNoticesSearch {
	noticeStatus?: NoticeStatus;
	noticeCategory?: NoticeCategory;
	text?: string;
}

export interface FAllNoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FAllNoticesSearch;
}

export interface CreateNoticeVars {
	input: FNoticeInput;
}

export interface CreateNoticeRes {
	createNotice: FNotice;
}

export interface UpdateNoticeByAdminVars {
	input: FNoticeUpdate;
}

export interface UpdateNoticeByAdminRes {
	updateNoticeByAdmin: FNotice;
}

export interface RemoveNoticeByAdminVars {
	input: string;
}

export interface RemoveNoticeByAdminRes {
	removeNoticeByAdmin: FNotice;
}

export interface GetNoticeVars {
	input: string;
}

export interface GetNoticeRes {
	getNotice: FNotice;
}

export interface GetNoticesVars {
	input: FNoticesInquiry;
}

export interface GetNoticesRes {
	getNotices: FNotices;
}

export interface GetAllNoticesByAdminVars {
	input: FAllNoticesInquiry;
}

export interface GetAllNoticesByAdminRes {
	getAllNoticesByAdmin: FNotices;
}
