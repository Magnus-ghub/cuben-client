import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
  Box,
  List,
  ListItem,
  Stack,
  Typography,
  Divider,
  Select,
  MenuItem,
  TablePagination,
} from '@mui/material';
import { ShoppingBag, MapPin } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { ProductStatus } from '../../../libs/enums/product.enum';
import { ProductUpdate } from '../../../libs/types/product/product.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { ProductPanelList } from '../../../libs/components/admin/products/ProductList';
import { REMOVE_PRODUCT_BY_ADMIN, UPDATE_PRODUCT_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { Direction } from '../../../libs/enums/common.enum';

const AdminProducts: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [productsInquiry, setProductsInquiry] = useState<AllProductsInquiry>({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: Direction.DESC,
    search: {},
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState<number>(0);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchLocation, setSearchLocation] = useState<string>('ALL');

  /** Apollo */
  const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
  const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

  const { loading, data, refetch: refetchProducts } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: productsInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (res: T) => {
      setProducts(res?.getAllProductsByAdmin?.list ?? []);
      setProductsTotal(res?.getAllProductsByAdmin?.metaCounter?.[0]?.total ?? 0);
    },
  });

  useEffect(() => {
    refetchProducts({ input: productsInquiry });
  }, [productsInquiry, refetchProducts]);

  /** Handlers */
  const handlePageChange = (event: unknown, newPage: number) => {
    setProductsInquiry((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductsInquiry((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, productId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };

  const handleUpdateProduct = async (productId: string, update: Partial<ProductUpdate>) => {
    try {
      await updateProductByAdmin({
        variables: { input: { _id: productId, ...update } },
      });
      handleCloseMenu();
      await refetchProducts({ input: productsInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    const confirmed = await sweetConfirmAlert('Are you sure you want to permanently delete this product?');
    if (!confirmed) return;

    try {
      await removeProductByAdmin({ variables: { input: productId } });
      handleCloseMenu();
      await refetchProducts({ input: productsInquiry });
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const handleStatusTabChange = (newValue: string) => {
    setFilterStatus(newValue);

    const nextInquiry: AllProductsInquiry = {
      ...productsInquiry,
      page: 1,
    };

    if (newValue !== 'ALL') {
      nextInquiry.search = {
        ...nextInquiry.search,
        productStatus: newValue as ProductStatus,
      };
    } else {
      const { productStatus, ...rest } = nextInquiry.search ?? {};
      nextInquiry.search = rest;
    }

    setProductsInquiry(nextInquiry);
  };

  return (
    <Box className="admin-users-container">
      <Box className="page-header">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography className="tit">Marketplace Management</Typography>
            <Typography variant="body2" color="textSecondary">
              Control all products and services posted by students
            </Typography>
          </Box>
          <ShoppingBag size={40} color="#6366f1" opacity={0.2} />
        </Stack>
      </Box>

      <Box className="table-wrap">
        <List className="tab-menu" sx={{ display: 'flex' }}>
          {['ALL', 'ACTIVE', 'SOLD', 'DELETE'].map((status) => (
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

        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="textSecondary">Loading products...</Typography>
          </Box>
        ) : (
          <ProductPanelList
            products={products}
            anchorEl={anchorEl}
            selectedProductId={selectedProductId}
            handleMenuOpen={handleOpenMenu}
            handleMenuClose={handleCloseMenu}
            updateProductHandler={handleUpdateProduct}
            removeProductHandler={handleRemoveProduct}
          />
        )}

        <TablePagination
          rowsPerPageOptions={[10, 20, 40, 80]}
          component="div"
          count={productsTotal}
          rowsPerPage={productsInquiry.limit ?? 10}
          page={(productsInquiry.page ?? 1) - 1}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Box>
  );
};

export default withAdminLayout(AdminProducts);