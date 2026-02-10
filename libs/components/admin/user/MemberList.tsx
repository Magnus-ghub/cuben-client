import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Typography,
  Stack,
} from '@mui/material';
import { Member } from '../../../types/member/member';           // adjust path if needed
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';

interface MemberPanelListProps {
  members: Member[];
  anchorEl: HTMLElement | null;
  selectedMemberId: string | null;
  menuOpenFor: 'type' | 'status' | null;
  handleMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    memberId: string,
    target: 'type' | 'status'
  ) => void;
  handleMenuClose: () => void;
  updateMemberHandler: (
    memberId: string,
    field: 'memberType' | 'memberStatus',
    newValue: string
  ) => void;
}

const typeOptions = Object.values(MemberType);
const statusOptions = Object.values(MemberStatus);

export const MemberPanelList = (props: MemberPanelListProps) => {
  const {
    members,
    anchorEl,
    selectedMemberId,
    menuOpenFor,
    handleMenuOpen,
    handleMenuClose,
    updateMemberHandler,
  } = props;

  const isTypeMenuOpen = Boolean(anchorEl && menuOpenFor === 'type');
  const isStatusMenuOpen = Boolean(anchorEl && menuOpenFor === 'status');

  // Optional: helps avoid repeated .find() in render
  const currentMember = selectedMemberId
    ? members.find((m) => m._id === selectedMemberId)
    : null;

  return (
    <TableContainer className="member-table">
      <Table stickyHeader aria-label="members table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell align="center">Full Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Warnings</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                <Typography color="textSecondary">No members found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow hover key={member._id}>
                {/* Short ID */}
                <TableCell sx={{ color: '#94a3b8', fontSize: '12px' }}>
                  {member._id.toString().slice(-6)}
                </TableCell>

                {/* Nickname + Avatar */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/member?memberId=${member._id}`}>
                      <Avatar
                        src={
                          member.memberImage
                            ? `${REACT_APP_API_URL}/${member.memberImage}`
                            : '/img/profile/defaultUser.svg'
                        }
                        sx={{ width: 38, height: 38, border: '1px solid #e2e8f0' }}
                      />
                    </Link>
                    <Link href={`/member?memberId=${member._id}`} className="member-nick">
                      {member.memberNick || '—'}
                    </Link>
                  </Stack>
                </TableCell>

                <TableCell align="center">{member.memberFullName || '—'}</TableCell>

                <TableCell>{member.memberPhone || '—'}</TableCell>

                {/* Member Type */}
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, member._id, 'type')}
                    className={`badge ${member.memberType}`}
                    sx={{ minWidth: 80 }}
                  >
                    {member.memberType}
                  </Button>
                </TableCell>

                {/* Warnings */}
                <TableCell align="center">
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: member.memberWarnings > 2 ? '#ef4444' : '#64748b',
                    }}
                  >
                    {member.memberWarnings ?? 0}
                  </Typography>
                </TableCell>

                {/* Member Status */}
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, member._id, 'status')}
                    className={`badge ${member.memberStatus}`}
                    sx={{ minWidth: 80 }}
                  >
                    {member.memberStatus}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Type Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isTypeMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { minWidth: 140 } }}
      >
        {typeOptions.map((type) => (
          <MenuItem
            key={type}
            selected={currentMember?.memberType === type}
            onClick={() => {
              if (selectedMemberId) {
                updateMemberHandler(selectedMemberId, 'memberType', type);
              }
              handleMenuClose();
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Menu>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isStatusMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { minWidth: 140 } }}
      >
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            selected={currentMember?.memberStatus === status}
            onClick={() => {
              if (selectedMemberId) {
                updateMemberHandler(selectedMemberId, 'memberStatus', status);
              }
              handleMenuClose();
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
};