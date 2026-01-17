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
	Divider,
	Box,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Product } from '../../../types/product/product';
import { ProductStatus } from '../../../enums/product.enum';


interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
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
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
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

interface ProductPanelListType {
	products: Product[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}

export const ProductPanelList = (props: ProductPanelListType) => {
    const { products, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateProductHandler, removeProductHandler } = props;

    return (
        <TableContainer className="member-table">
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Mahsulot</TableCell>
                        <TableCell align="center">Narxi</TableCell>
                        <TableCell align="center">Sotuvchi</TableCell>
                        <TableCell align="center">Lokatsiya</TableCell>
                        <TableCell align="center">Kategoriya</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 8 }}>Ma'lumot topilmadi</TableCell>
                        </TableRow>
                    ) : (
                        products.map((product, index) => (
                            <TableRow hover key={product._id}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar 
                                            variant="rounded"
                                            src={`${REACT_APP_API_URL}/${product?.productImages[0]}`} 
                                            sx={{ width: 45, height: 45, borderRadius: '8px' }}
                                        />
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                                                {product.productName}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
                                                ID: {product._id.toString().slice(-5)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>

                                <TableCell align="center">
                                    <Typography sx={{ fontWeight: 700, color: '#10b981' }}>
                                        {product.productPrice.toLocaleString()} ₩
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                                        {product.memberData?.memberNick}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>
                                        {product.productType}
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    <Button 
                                        onClick={(e) => menuIconClickHandler(e, index)}
                                        className={`badge ${product.productStatus}`}
                                        sx={{ minWidth: '90px' }}
                                    >
                                        {product.productStatus}
                                    </Button>
                                    
                                    {/* Status Menu - Reserved, Sold va boshqalarni boshqarish */}
                                    <Menu
                                        anchorEl={anchorEl[index]}
                                        open={Boolean(anchorEl[index])}
                                        onClose={menuIconCloseHandler}
                                    >
                                        {Object.values(ProductStatus)
                                            .filter((s) => s !== product.productStatus)
                                            .map((status) => (
                                                <MenuItem 
                                                    key={status}
                                                    onClick={() => updateProductHandler({ _id: product._id, productStatus: status })}
                                                >
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        <Divider />
                                        <MenuItem onClick={() => removeProductHandler(product._id)} sx={{ color: '#ef4444' }}>
                                            Butunlay o'chirish
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
