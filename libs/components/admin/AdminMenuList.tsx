import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box,  } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Users, ShoppingBag, MessageSquare, NewspaperIcon } from 'lucide-react';

const AdminMenuList = () => {
	const router = useRouter();
	const { pathname } = router;
	const [openMenu, setOpenMenu] = useState<string | null>('Users');

	// Sahifa yuklanganda aktiv menyuni aniqlash
	useEffect(() => {
		if (pathname.includes('products')) setOpenMenu('Products');
		else if (pathname.includes('community')) setOpenMenu('Community');
		else if (pathname.includes('cs')) setOpenMenu('Cs');
		else setOpenMenu('Users');
	}, [pathname]);

	const handleMenuClick = (menu: string) => {
		setOpenMenu(openMenu === menu ? null : menu);
	};

	const menuItems = [
		{
			title: 'Users',
			icon: <Users size={20} />,
			subMenus: [{ title: 'Users List', url: '/_admin/users' }],
		},
		{
			title: 'Products',
			icon: <ShoppingBag size={20} />,
			subMenus: [{ title: 'Products List', url: '/_admin/products' }],
		},
		{
			title: 'Articles',
			icon: <MessageSquare size={20} />,
			subMenus: [{ title: 'Articles', url: '/_admin/article' }],
		},
		{
			title: 'Posts',
			icon: <NewspaperIcon size={20} />,
			subMenus: [{ title: 'Posts', url: '/_admin/post' }],
		},
	];

	return (
		<List sx={{ width: '100%', px: 1.5, mt: 2 }} component="nav" disablePadding>
			{menuItems.map((item) => {
				const isMenuOpen = openMenu === item.title;
				const isParentActive = pathname.includes(item.title.toLowerCase());

				return (
					<Box key={item.title} sx={{ mb: 1 }}>
						<ListItemButton
							onClick={() => handleMenuClick(item.title)}
							className={`nav-item ${isParentActive ? 'parent-active' : ''}`}
							sx={{
								borderRadius: '12px',
								py: 1.5,
								color: isParentActive ? '#fff' : '#94a3b8',
								'&:hover': { background: 'rgba(255,255,255,0.05)' },
							}}
						>
							<ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
							<ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '14px', fontWeight: 600 }} />
							{isMenuOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>

						<Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
							<List component="div" disablePadding sx={{ mt: 0.5 }}>
								{item.subMenus.map((sub) => {
									const isSubActive = pathname === sub.url;
									return (
										<Link href={sub.url} key={sub.url} style={{ textDecoration: 'none' }}>
											<ListItemButton
												sx={{
													pl: 6,
													py: 1,
													borderRadius: '10px',
													color: isSubActive ? '#6366f1' : '#64748b',
													background: isSubActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
													'&:hover': { color: '#fff' },
												}}
											>
												<ListItemText
													primary={sub.title}
													primaryTypographyProps={{ fontSize: '13px', fontWeight: isSubActive ? 600 : 500 }}
												/>
											</ListItemButton>
										</Link>
									);
								})}
							</List>
						</Collapse>
					</Box>
				);
			})}
		</List>
	);
};

export default AdminMenuList;
