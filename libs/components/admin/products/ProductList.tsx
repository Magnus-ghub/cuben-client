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
  Box,
} from '@mui/material';
import { REACT_APP_API_URL } from '../../../config';
import { Product } from '../../../types/product/product';
import { ProductStatus } from '../../../enums/product.enum';
import { ProductUpdate } from '../../../types/product/product.update';

interface ProductPanelListProps {
  products: Product[];
  anchorEl: HTMLElement | null;
  selectedProductId: string | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, productId: string) => void;
  handleMenuClose: () => void;
  updateProductHandler: (productId: string, update: Partial<ProductUpdate>) => void;
  removeProductHandler: (productId: string) => void;
}

const statusOptions = Object.values(ProductStatus);

export const ProductPanelList = (props: ProductPanelListProps) => {
  const {
    products,
    anchorEl,
    selectedProductId,
    handleMenuOpen,
    handleMenuClose,
    updateProductHandler,
    removeProductHandler,
  } = props;

  const isMenuOpen = Boolean(anchorEl && selectedProductId);
  const currentProduct = selectedProductId
    ? products.find((p) => p._id === selectedProductId)
    : null;

  return (
    <TableContainer className="member-table">
      <Table stickyHeader aria-label="products table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Seller</TableCell>
            <TableCell align="center">Location</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                <Typography color="textSecondary">No products found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow hover key={product._id}>
                {/* Product Info */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Link href={`/product/${product._id}`} target="_blank">
                      <Avatar
                        variant="rounded"
                        src={
                          product.productImages?.[0]
                            ? `${REACT_APP_API_URL}/${product.productImages[0]}`
                            : '/img/default-product.png'
                        }
                        sx={{ width: 56, height: 56, borderRadius: '10px', border: '1px solid #e2e8f0' }}
                      />
                    </Link>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '14.5px', color: '#1e293b' }}>
                        {product.productName || '—'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
                        ID: {product._id.toString().slice(-6)}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '15px' }}>
                    {product.productPrice.toLocaleString()} ₩
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                    {product.memberData?.memberNick || '—'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography sx={{ fontSize: '13.5px', color: '#6366f1', fontWeight: 500 }}>
                    {product.productAddress || '—'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#4f46e5',
                      textTransform: 'capitalize',
                    }}
                  >
                    {product.productType?.toLowerCase() || '—'}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, product._id)}
                    className={`badge ${product.productStatus}`}
                    sx={{ minWidth: 92, textTransform: 'uppercase', fontSize: '12.5px' }}
                  >
                    {product.productStatus}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { minWidth: 160 } }}
      >
        {statusOptions
          .filter((s) => s !== currentProduct?.productStatus)
          .map((status) => (
            <MenuItem
              key={status}
              onClick={() => {
                if (selectedProductId) {
                  updateProductHandler(selectedProductId, { productStatus: status });
                }
              }}
              sx={{
                color: status === ProductStatus.SOLD ? '#ef4444' : undefined,
                fontWeight: status === ProductStatus.SOLD ? 600 : 400,
              }}
            >
              {status}
            </MenuItem>
          ))}

        <MenuItem
          onClick={() => selectedProductId && removeProductHandler(selectedProductId)}
          sx={{ color: '#ef4444', fontWeight: 600 }}
        >
          Permanently Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};