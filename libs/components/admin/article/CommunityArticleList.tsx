import React from 'react';
import Link from 'next/link';
import {
	Box,
	Button,
	Menu,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { Eye, Heart, ExternalLink, DeleteIcon } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Moment from 'react-moment';
import { BoardArticle } from '../../../types/article/article';
import { REACT_APP_API_URL } from '../../../config';
import Typography from '@mui/material/Typography';
import { BoardArticleStatus } from '../../../enums/article.enum';

interface Data {
	category: string;
	title: string;
	writer: string;
	register: string;
	view: number;
	like: number;
	status: string;
	article_id: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'article_id',
		numeric: true,
		disablePadding: false,
		label: 'ARTICLE ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'WRITER',
	},
	{
		id: 'view',
		numeric: false,
		disablePadding: false,
		label: 'VIEW',
	},
	{
		id: 'like',
		numeric: false,
		disablePadding: false,
		label: 'LIKE',
	},
	{
		id: 'register',
		numeric: true,
		disablePadding: false,
		label: 'REGISTER DATE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, product: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
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

interface CommunityArticleListProps {
	articles: BoardArticle[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}

const CommunityArticleList = (props: CommunityArticleListProps) => {
	const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
		props;

	return (
        <TableContainer className="member-table">
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Maqola sarlavhasi</TableCell>
                        <TableCell align="center">Kategoriya</TableCell>
                        <TableCell align="center">Muallif</TableCell>
                        <TableCell align="center">Statistika</TableCell>
                        <TableCell align="center">Sana</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articles.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 8 }}>Hech qanday maqola topilmadi</TableCell>
                        </TableRow>
                    ) : (
                        articles.map((article, index) => (
                            <TableRow hover key={article._id}>
                                <TableCell sx={{ maxWidth: '300px' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography noWrap sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                                            {article.articleTitle}
                                        </Typography>
                                        {article.articleStatus === BoardArticleStatus.ACTIVE && (
                                            <Link href={`/community/detail?id=${article._id}`}>
                                                <IconButton size="small" sx={{ color: '#6366f1' }}>
                                                    <ExternalLink size={16} />
                                                </IconButton>
                                            </Link>
                                        )}
                                    </Stack>
                                </TableCell>

                                <TableCell align="center">
                                    <Box sx={{ 
                                        px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                        background: '#f1f5f9', color: '#475569', display: 'inline-block'
                                    }}>
                                        {article.articleCategory}
                                    </Box>
                                </TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                        <Avatar 
                                            src={article?.memberData?.memberImage ? `${REACT_APP_API_URL}/${article?.memberData?.memberImage}` : '/img/profile/defaultUser.svg'} 
                                            sx={{ width: 28, height: 28 }}
                                        />
                                        <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                                            {article?.memberData?.memberNick}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ color: '#94a3b8' }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Eye size={14} />
                                            <Typography variant="caption">{article.articleViews}</Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Heart size={14} />
                                            <Typography variant="caption">{article.articleLikes}</Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>

                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '12px', color: '#64748b' }}>
                                        <Moment format="DD.MM.YYYY">{article.createdAt}</Moment>
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    {article.articleStatus === BoardArticleStatus.DELETE ? (
                                        <IconButton onClick={() => removeArticleHandler(article._id)} color="error">
                                            <DeleteIcon size="small" />
                                        </IconButton>
                                    ) : (
                                        <>
                                            <Button 
                                                onClick={(e) => menuIconClickHandler(e, index)}
                                                className={`badge ${article.articleStatus}`}
                                            >
                                                {article.articleStatus}
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl[index]}
                                                open={Boolean(anchorEl[index])}
                                                onClose={menuIconCloseHandler}
                                            >
                                                {Object.values(BoardArticleStatus)
                                                    .filter((s) => s !== article.articleStatus)
                                                    .map((status) => (
                                                        <MenuItem 
                                                            key={status}
                                                            onClick={() => updateArticleHandler({ _id: article._id, articleStatus: status })}
                                                        >
                                                            {status}
                                                        </MenuItem>
                                                    ))}
                                            </Menu>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CommunityArticleList;







