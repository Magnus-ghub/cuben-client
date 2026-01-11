import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import { ShoppingBag, MapPin } from 'lucide-react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../../libs/types/common';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { REMOVE_PRODUCT_BY_ADMIN, UPDATE_PRODUCT_BY_ADMIN } from '../../../libs/apollo/admin/mutation';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../libs/apollo/admin/query';
import { ProductStatus } from '../../../libs/enums/product.enum';
import { ProductUpdate } from '../../../libs/types/product/product.update';
import { ProductPanelList } from '../../../libs/components/admin/products/ProductList';

const AdminProducts: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [productsInquiry, setProductsInquiry] = useState<AllProductsInquiry>(initialInquiry);
	const [products, setProducts] = useState<Product[]>([]);
	const [productsTotal, setProductsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		productsInquiry?.search?.productStatus ? productsInquiry?.search?.productStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
	const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

	const {
		loading: getAllProductsByAdminLoading,
		data: getAllProductsByAdminData,
		error: getAllProductsByAdminError,
		refetch: getAllProductsByAdminRefetch,
	} = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: productsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setProducts(data?.getAllProductsByAdmin?.list);
			setProductsTotal(data?.getAllProductsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllProductsByAdminRefetch({ input: productsInquiry }).then();
	}, [productsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		productsInquiry.page = newPage + 1;
		await getAllProductsByAdminRefetch({ input: productsInquiry });
		setProductsInquiry({ ...productsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		productsInquiry.limit = parseInt(event.target.value, 10);
		productsInquiry.page = 1;
		await getAllProductsByAdminRefetch({ input: productsInquiry });
		setProductsInquiry({ ...productsInquiry });
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
    
    let searchUpdate: any = { ...productsInquiry.search };
    
    if (newValue !== 'ALL') {
        searchUpdate.productStatus = newValue as ProductStatus;
    } else {
        delete searchUpdate.productStatus;
    }

    setProductsInquiry({
        ...productsInquiry,
        page: 1,
        search: searchUpdate
    });
};

	const removeProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeProductByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllProductsByAdminRefetch({ input: productsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
    try {
        setSearchType(newValue);

        const newInquiry = { ...productsInquiry, page: 1 };

        setProductsInquiry(newInquiry);
    } catch (err: any) {
        console.log('searchTypeHandler: ', err.message);
    }
};

	const updateProductHandler = async (updateData: ProductUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateProductByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllProductsByAdminRefetch({ input: productsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
        <Box className="admin-users-container"> {/* Umumiy layout stilidan foydalanamiz */}
            <Box className="page-header">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography className="tit">Marketplace Boshqaruvi</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Talabalar tomonidan joylangan barcha mahsulotlar va xizmatlar nazorati
                        </Typography>
                    </Box>
                    <ShoppingBag size={40} color="#6366f1" opacity={0.2} />
                </Stack>
            </Box>

            <Box className="table-wrap">
                <TabContext value={value}>
                    <List className="tab-menu">
                        {['ALL', 'ACTIVE', 'SOLD', 'DELETE'].map((status) => (
                            <ListItem
                                key={status}
                                onClick={(e) => tabChangeHandler(e, status)}
                                className={value === status ? 'li on' : 'li'}
                            >
                                {status === 'ALL' ? 'Barchasi' : status}
                            </ListItem>
                        ))}
                    </List>
                    
                    <Divider />

                    <Stack className="search-area" direction="row" alignItems="center" sx={{ p: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                            <MapPin size={20} color="#6366f1" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Lokatsiya bo'yicha:</Typography>
                            <Select 
                                className="type-select" 
                                value={searchType} 
                                sx={{ minWidth: 200, height: 40 }}
                            >
                                <MenuItem value="ALL" onClick={() => searchTypeHandler('ALL')}>Barcha hududlar</MenuItem>
                            </Select>
                        </Stack>
                    </Stack>

                    <ProductPanelList
                        products={products}
                        anchorEl={anchorEl}
                        menuIconClickHandler={menuIconClickHandler}
                        menuIconCloseHandler={menuIconCloseHandler}
                        updateProductHandler={updateProductHandler}
                        removeProductHandler={removeProductHandler}
                    />

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 40]}
                        component="div"
                        count={productsTotal}
                        rowsPerPage={productsInquiry?.limit}
                        page={productsInquiry?.page - 1}
                        onPageChange={changePageHandler}
                        onRowsPerPageChange={changeRowsPerPageHandler}
                    />
                </TabContext>
            </Box>
        </Box>
    );
};

AdminProducts.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminProducts);




