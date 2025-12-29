import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Member } from '../../../types/member/member';
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';

interface Data {
	id: string;
	nickname: string;
	fullname: string;
	phone: string;
	type: string;
	state: string;
	warning: string;
	block: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'nickname',
		numeric: true,
		disablePadding: false,
		label: 'NICK NAME',
	},
	{
		id: 'fullname',
		numeric: false,
		disablePadding: false,
		label: 'FULL NAME',
	},
	{
		id: 'phone',
		numeric: true,
		disablePadding: false,
		label: 'PHONE NUM',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'MEMBER TYPE',
	},
	{
		id: 'warning',
		numeric: false,
		disablePadding: false,
		label: 'WARNING',
	},
	{
		id: 'block',
		numeric: false,
		disablePadding: false,
		label: 'BLOCK CRIMES',
	},
	{
		id: 'state',
		numeric: false,
		disablePadding: false,
		label: 'STATE',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, product: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface MemberPanelListType {
	members: Member[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMemberHandler: any;
}

// ... (HeadCells va mantiqiy qismlar bir xil)

export const MemberPanelList = (props: MemberPanelListType) => {
    const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

    return (
        <TableContainer className="member-table">
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Foydalanuvchi</TableCell>
                        <TableCell align="center">Ism-sharifi</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell align="center">Turi</TableCell>
                        <TableCell align="center">Ogohlantirish</TableCell>
                        <TableCell align="center">Holati</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={7} sx={{ py: 10 }}>
                                <Typography color="textSecondary">Ma'lumot topilmadi</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        members.map((member, index) => (
                            <TableRow hover key={member._id}>
                                <TableCell sx={{ color: '#94a3b8', fontSize: '12px' }}>
                                    {member._id.toString().slice(-5)}
                                </TableCell>
                                
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Link href={`/member?memberId=${member._id}`}>
                                            <Avatar 
                                                src={member.memberImage ? `${REACT_APP_API_URL}/${member.memberImage}` : '/img/profile/defaultUser.svg'} 
                                                sx={{ width: 36, height: 36, border: '1px solid #e2e8f0' }}
                                            />
                                        </Link>
                                        <Link href={`/member?memberId=${member._id}`} className="member-nick">
                                            {member.memberNick}
                                        </Link>
                                    </Stack>
                                </TableCell>

                                <TableCell align="center">{member.memberFullName ?? '-'}</TableCell>
                                <TableCell>{member.memberPhone}</TableCell>

                                <TableCell align="center">
                                    <Button 
                                        onClick={(e) => menuIconClickHandler(e, index)}
                                        className={`badge ${member.memberType}`}
                                    >
                                        {member.memberType}
                                    </Button>
                                    {/* Menu qismi bir xil qoladi */}
                                </TableCell>

                                <TableCell align="center">
                                    <Typography sx={{ fontWeight: 600, color: member.memberWarnings > 2 ? '#ef4444' : '#64748b' }}>
                                        {member.memberWarnings}
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <Button 
                                        onClick={(e) => menuIconClickHandler(e, member._id)}
                                        className={`badge ${member.memberStatus}`}
                                    >
                                        {member.memberStatus}
                                    </Button>
                                    {/* Status Menu qismi bir xil qoladi */}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};