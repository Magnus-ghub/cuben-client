import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	InputAdornment,
	List,
	ListItem,
	Stack,
	Typography,
	Divider,
	Select,
	MenuItem,
	OutlinedInput,
	TablePagination,
} from '@mui/material';
import { Search } from 'lucide-react';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useMutation, useQuery } from '@apollo/client';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { MemberUpdate } from '../../../libs/types/member/member.update';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { MemberPanelList } from '../../../libs/components/admin/user/MemberList';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../libs/apollo/admin/query';

const AdminUsers: NextPage = () => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
	const [menuOpenFor, setMenuOpenFor] = useState<'type' | 'status' | null>(null);

	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	});

	const [members, setMembers] = useState<Member[]>([]);
	const [membersTotal, setMembersTotal] = useState<number>(0);

	const [filterStatus, setFilterStatus] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState<string>('ALL');

	/** Apollo */
	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	const {
		loading,
		data,
		error,
		refetch: refetchMembers,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: membersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (res: T) => {
			setMembers(res?.getAllMembersByAdmin?.list ?? []);
			setMembersTotal(res?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** Effects */
	useEffect(() => {
		refetchMembers({ input: membersInquiry });
	}, [membersInquiry, refetchMembers]);

	/** Handlers */
	const handlePageChange = (event: unknown, newPage: number) => {
		setMembersInquiry((prev) => ({ ...prev, page: newPage + 1 }));
	};

	const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMembersInquiry((prev) => ({
			...prev,
			limit: parseInt(e.target.value, 10),
			page: 1,
		}));
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, memberId: string, target: 'type' | 'status') => {
		setAnchorEl(event.currentTarget);
		setSelectedMemberId(memberId);
		setMenuOpenFor(target);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setSelectedMemberId(null);
		setMenuOpenFor(null);
	};

	const handleUpdateMember = async (memberId: string, field: 'memberType' | 'memberStatus', value: string) => {
		try {
			await updateMemberByAdmin({
				variables: {
					input: { _id: memberId, [field]: value },
				},
			});
			handleCloseMenu();
			await refetchMembers({ input: membersInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const handleStatusTabChange = (newValue: string) => {
		setFilterStatus(newValue);
		setSearchText('');

		const nextInquiry: MembersInquiry = {
			...membersInquiry,
			page: 1,
			sort: 'createdAt',
		};

		if (newValue !== 'ALL') {
			nextInquiry.search = {
				...nextInquiry.search,
				memberStatus: newValue as MemberStatus,
			};
		} else {
			const { memberStatus, ...rest } = nextInquiry.search ?? {};
			nextInquiry.search = rest;
		}

		setMembersInquiry(nextInquiry);
	};

	const handleSearchTypeChange = (newValue: string) => {
		setSearchType(newValue);

		const nextInquiry: MembersInquiry = {
			...membersInquiry,
			page: 1,
			sort: 'createdAt',
		};

		if (newValue !== 'ALL') {
			nextInquiry.search = {
				...nextInquiry.search,
				memberType: newValue as MemberType,
			};
		} else {
			const { memberType, ...rest } = nextInquiry.search ?? {};
			nextInquiry.search = rest;
		}

		setMembersInquiry(nextInquiry);
	};

	const handleSearchText = useCallback(() => {
		setMembersInquiry((prev) => ({
			...prev,
			page: 1,
			search: {
				...prev.search,
				text: searchText.trim() || undefined,
			},
		}));
	}, [searchText]);

	return (
		<Box className="admin-users-container">
			<Box className="page-header">
				<Typography className="tit">Community Members</Typography>
				<Typography variant="body2" color="textSecondary">
					Manage all members of the Cuben platform
				</Typography>
			</Box>

			<Box className="table-wrap">
				<List className="tab-menu" sx={{ display: 'flex' }}>
					{['ALL', 'ACTIVE', 'BLOCK', 'DELETE'].map((status) => (
						<ListItem
							key={status}
							onClick={() => handleStatusTabChange(status)}
							className={filterStatus === status ? 'li on' : 'li'}
							sx={{ cursor: 'pointer' }}
						>
							{status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
						</ListItem>
					))}
				</List>

				<Divider />

				<Stack direction="row" className="search-area" spacing={2} alignItems="center" sx={{ p: 3 }}>
					<OutlinedInput
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						fullWidth
						className="search-input"
						placeholder="Search by name or nickname..."
						onKeyDown={(e) => e.key === 'Enter' && handleSearchText()}
						startAdornment={
							<InputAdornment position="start">
								<Search size={20} color="#64748b" />
							</InputAdornment>
						}
						endAdornment={
							searchText && (
								<InputAdornment position="end">
									<CancelRoundedIcon
										fontSize="small"
										sx={{ cursor: 'pointer', color: '#94a3b8' }}
										onClick={() => {
											setSearchText('');
											handleSearchText();
										}}
									/>
								</InputAdornment>
							)
						}
					/>

					<Select
						value={searchType}
						onChange={(e) => handleSearchTypeChange(e.target.value as string)}
						className="type-select"
						sx={{ minWidth: 160 }}
					>
						<MenuItem value="ALL">All Types</MenuItem>
						<MenuItem value={MemberType.USER}>Student</MenuItem>
						<MenuItem value={MemberType.AGENT}>Staff</MenuItem>
						<MenuItem value={MemberType.ADMIN}>Admin</MenuItem>
					</Select>
				</Stack>

				<MemberPanelList
					members={members}
					anchorEl={anchorEl}
					selectedMemberId={selectedMemberId}
					menuOpenFor={menuOpenFor}
					handleMenuOpen={handleOpenMenu}
					handleMenuClose={handleCloseMenu}
					updateMemberHandler={handleUpdateMember}
				/>

				<TablePagination
					rowsPerPageOptions={[10, 20, 40, 80]}
					component="div"
					count={membersTotal}
					rowsPerPage={membersInquiry.limit ?? 10}
					page={(membersInquiry.page ?? 1) - 1}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsPerPageChange}
				/>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminUsers);
