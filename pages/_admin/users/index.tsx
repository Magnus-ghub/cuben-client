import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { MemberUpdate } from '../../../libs/types/member/member.update';
import { Search } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../../libs/types/common';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { MemberPanelList } from '../../../libs/components/admin/user/MemberList';

const AdminUsers: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialInquiry);
	const [members, setMembers] = useState<Member[]>([]);
	const [membersTotal, setMembersTotal] = useState<number>(0);
	const [value, setValue] = useState(
		membersInquiry?.search?.memberStatus ? membersInquiry?.search?.memberStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	const {
		loading: getAllMembersByAdminLoading,
		data: getAllMembersByAdminData,
		error: getAllMembersByAdminError,
		refetch: getAllMembersRefetch,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: membersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setMembers(data?.getAllMembersByAdmin?.list);
			setMembersTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllMembersRefetch({ input: membersInquiry }).then();
	}, [membersInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		membersInquiry.page = newPage + 1;
		await getAllMembersRefetch({ input: membersInquiry });
		setMembersInquiry({ ...membersInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		membersInquiry.limit = parseInt(event.target.value, 10);
		membersInquiry.page = 1;
		await getAllMembersRefetch({ input: membersInquiry });
		setMembersInquiry({ ...membersInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		setMembersInquiry({ ...membersInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.ACTIVE } });
				break;
			case 'BLOCK':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.BLOCK } });
				break;
			case 'DELETE':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.DELETE } });
				break;
			default:
				delete membersInquiry?.search?.memberStatus;
				setMembersInquiry({ ...membersInquiry });
				break;
		}
	};

	const updateMemberHandler = async (updateData: MemberUpdate) => {
		try {
			await updateMemberByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllMembersRefetch({ input: membersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setMembersInquiry({
				...membersInquiry,
				search: {
					...membersInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setMembersInquiry({
					...membersInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...membersInquiry.search,
						memberType: newValue as MemberType,
					},
				});
			} else {
				delete membersInquiry?.search?.memberType;
				setMembersInquiry({ ...membersInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	return (
        <Box className="admin-users-container">
            <Box className="page-header">
                <Typography className="tit">Foydalanuvchilar Hamjamiyati</Typography>
                <Typography variant="body2" color="textSecondary">Cuben platformasining barcha a'zolarini boshqarish</Typography>
            </Box>

            <Box className="table-wrap">
                <TabContext value={value}>
                    <List className="tab-menu">
                        {['ALL', 'ACTIVE', 'BLOCK', 'DELETE'].map((status) => (
                            <ListItem
                                key={status}
                                onClick={(e) => tabChangeHandler(e, status)}
                                className={value === status ? 'li on' : 'li'}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </ListItem>
                        ))}
                    </List>
                    
                    <Divider />

                    <Stack className="search-area">
                        <OutlinedInput
                            value={searchText}
                            onChange={(e) => textHandler(e.target.value)}
                            fullWidth
                            className="search-input"
                            placeholder="Talaba ismi yoki taxallusi bo'yicha qidirish..."
                            onKeyDown={(event) => event.key === 'Enter' && searchTextHandler()}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Search size={20} color="#64748b" />
                                </InputAdornment>
                            }
                        />
                        <Select 
                            className="type-select" 
                            value={searchType} 
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="ALL" onClick={() => searchTypeHandler('ALL')}>Barcha turlar</MenuItem>
                            <MenuItem value="USER" onClick={() => searchTypeHandler('USER')}>Talaba</MenuItem>
                            <MenuItem value="AGENT" onClick={() => searchTypeHandler('AGENT')}>Hamkor</MenuItem>
                            <MenuItem value="ADMIN" onClick={() => searchTypeHandler('ADMIN')}>Admin</MenuItem>
                        </Select>
                    </Stack>

                    <MemberPanelList
                        members={members}
                        anchorEl={anchorEl}
                        menuIconClickHandler={menuIconClickHandler}
                        menuIconCloseHandler={menuIconCloseHandler}
                        updateMemberHandler={updateMemberHandler}
                    />

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 40]}
                        component="div"
                        count={membersTotal}
                        rowsPerPage={membersInquiry?.limit}
                        page={membersInquiry?.page - 1}
                        onPageChange={changePageHandler}
                        onRowsPerPageChange={changeRowsPerPageHandler}
                    />
                </TabContext>
            </Box>
        </Box>
    );
};

AdminUsers.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminUsers);




