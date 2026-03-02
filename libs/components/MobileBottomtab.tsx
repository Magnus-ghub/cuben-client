import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, MenuItem } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';

const MobileBottomtab: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { t } = useTranslation('common');
  const user = useReactiveVar(userVar);
  const [createAnchor, setCreateAnchor] = useState<null | HTMLElement>(null);

  const createOpen = Boolean(createAnchor);

  const handleCreateOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (!user?._id) {
      router.push('/account/join');
      return;
    }
    setCreateAnchor(e.currentTarget);
  };

  const handleCreateClose = () => {
    setCreateAnchor(null);
  };

  const handleCreateNavigate = (path: string) => {
    router.push(path);
    handleCreateClose();
  };

  const navItems = [
    { icon: 'bi-house', label: 'Home', path: '/' },
    { icon: 'bi-briefcase', label: 'Feed', path: '/opportunities' },
    { icon: 'bi-plus-circle-fill', label: '+', path: '/create', isCenter: true },
    { icon: 'bi-shop', label: 'Market', path: '/product' },
    { icon: 'bi-person', label: 'Profile', path: '/mypage' },
  ];

  return (
    <>
      <div className="mobile_bottom_nav">
        {navItems.map((item, index) =>
          item.isCenter ? (
            <button
              key={index}
              type="button"
              onClick={handleCreateOpen}
              className={`nav_item center_btn ${createOpen ? 'active' : ''}`}
              aria-label="Create menu"
            >
              <AddRoundedIcon className="create-plus-icon" />
            </button>
          ) : (
            <Link
              key={index}
              href={item.path}
              className={`nav_item ${currentPath === item.path ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ),
        )}
      </div>

      <Menu
        anchorEl={createAnchor}
        open={createOpen}
        onClose={handleCreateClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem onClick={() => handleCreateNavigate('/create/writePost')}>📝 {t('write_post')}</MenuItem>
        <MenuItem onClick={() => handleCreateNavigate('/create/listItem')}>🛒 {t('sell_item')}</MenuItem>
        {user?.memberType === 'AGENT' && (
          <MenuItem onClick={() => handleCreateNavigate('/create/postJob')}>💼 {t('post_job')}</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default MobileBottomtab;