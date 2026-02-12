import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Pagination, Stack, Typography, Menu, MenuItem, Fab } from '@mui/material';
import { NextPage } from 'next';
import { useEffect, useState, MouseEvent } from 'react';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import ProductCard from '../../libs/components/product/ProductCard';
import Filter from '../../libs/components/product/Filter';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { useRouter } from 'next/router';
import { Direction, Message } from '../../libs/enums/common.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_PRODUCT, SAVE_TARGET_PRODUCT } from '../../libs/apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { Product } from '../../libs/types/product/product';
import { GET_PRODUCTS } from '../../libs/apollo/user/query';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { useTranslation } from 'react-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MarketplaceList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
    const [filterSortName, setFilterSortName] = useState('new');
	const [showFilter, setShowFilter] = useState(true);
	const { t, i18n } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [saveTargetProduct] = useMutation(SAVE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (getProductsData?.getProducts) {
			setProducts(getProductsData.getProducts.list || []);
			setTotalCount(getProductsData.getProducts.metaCounter[0]?.total || 0);
		}
	}, [getProductsData]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
	}, [router]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
		getProductsRefetch({ input: searchFilter });
	}, [searchFilter]);

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			setProducts((prevProducts) =>
				prevProducts.map((product) => {
					if (product._id === id) {
						const isCurrentlyLiked = product.meLiked?.liked || false;
						return {
							...product,
							productLikes: isCurrentlyLiked ? product.productLikes - 1 : product.productLikes + 1,
							meLiked: {
								...product.meLiked,
								liked: !isCurrentlyLiked,
							},
						};
					}
					return product;
				}),
			);

			await likeTargetProduct({
				variables: { input: id },
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			await getProductsRefetch({ input: searchFilter });
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const saveProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			setProducts((prevProducts) =>
				prevProducts.map((product) => {
					if (product._id === id) {
						const isCurrentlySaved = product.meLiked?.saved || false;
						return {
							...product,
							meLiked: {
								...product.meLiked,
								saved: !isCurrentlySaved,
							},
						};
					}
					return product;
				}),
			);

			await saveTargetProduct({
				variables: { input: id },
			});

			await sweetTopSmallSuccessAlert('Saved successfully!', 800);
		} catch (err: any) {
			console.log('ERROR, saveProductHandler:', err.message);
			await getProductsRefetch({ input: searchFilter });
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const paginationHandler = async (e: T, value: number) => {
		const newSearch: ProductsInquiry = {
			...searchFilter,
			page: value,
		};

		setSearchFilter(newSearch);

		try {
			await getProductsRefetch({ input: newSearch });
		} catch (error) {
			console.error('Pagination refetch error:', error);
		}

		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortName('new');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName('lowestPrice');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName('highestPrice');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const handleSellItemClick = () => {
		router.push('/create/listItem');
	};

	if (device === 'mobile') {
		return <Stack>MARKETPLACE MOBILE</Stack>;
	} else {
		return (
			<div id="marketplace-page">
				<Stack className="container">
					{/* Header Section */}
					<Stack className="marketplace-header">
						<Stack className="header-left">
							<Typography className="page-title">{t('marketplace')}</Typography>
							<Typography className="page-subtitle">{t('discoverDeals')}</Typography>
						</Stack>
						<Stack className="header-right">
							<Button
								className="filter-toggle-btn"
								startIcon={<TuneRoundedIcon />}
								onClick={() => setShowFilter(!showFilter)}
							>
								{showFilter ? t('hideFilters') : t('showFilters')}
							</Button>
							<Stack className="sort-box">
								<Typography className="sort-label">{t('sortBy')}</Typography>
								<Button className="sort-btn" onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{t(filterSortName)}
								</Button>
								<Menu
									anchorEl={anchorEl}
									open={sortingOpen}
									onClose={sortingCloseHandler}
									PaperProps={{
										sx: {
											marginTop: '8px',
											borderRadius: '12px',
											boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
											border: '1px solid #e5e7eb',
											minWidth: '160px',
										},
									}}
								>
									<MenuItem
										onClick={sortingHandler}
										id={'new'}
										sx={{
											fontFamily: 'inherit',
											fontSize: '14px',
											padding: '10px 16px',
											'&:hover': {
												backgroundColor: '#f9fafb',
											},
										}}
									>
										{t('new')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'lowest'}
										sx={{
											fontFamily: 'inherit',
											fontSize: '14px',
											padding: '10px 16px',
											'&:hover': {
												backgroundColor: '#f9fafb',
											},
										}}
									>
										{t('lowestPrice')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'highest'}
										sx={{
											fontFamily: 'inherit',
											fontSize: '14px',
											padding: '10px 16px',
											'&:hover': {
												backgroundColor: '#f9fafb',
											},
										}}
									>
										{t('highestPrice')}
									</MenuItem>
								</Menu>
							</Stack>
						</Stack>
					</Stack>

					{/* Main Content */}
					<Stack className="marketplace-content">
						{/* Filter Sidebar */}
						{showFilter && (
							<Stack className="filter-sidebar">
								<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
							</Stack>
						)}

						{/* Products Grid */}
						<Stack className="products-container">
							{getProductsLoading ? (
								<Stack className="loading-state">
									<Typography>Loading products...</Typography>
								</Stack>
							) : (
								<>
									<Stack className="products-grid">
										{products.length === 0 ? (
											<Stack className="no-data">
												<img src="/img/icons/icoAlert.svg" alt="" />
												<Typography>{t('noProductsFound')}</Typography>
											</Stack>
										) : (
											products.map((product: Product) => (
												<ProductCard
													key={product?._id}
													product={product}
													likeProductHandler={likeProductHandler}
													saveProductHandler={saveProductHandler}
												/>
											))
										)}
									</Stack>

									{/* Pagination */}
									{totalCount > 0 && (
										<Stack className="pagination-container">
											<Pagination
												count={Math.ceil(totalCount / searchFilter.limit)}
												page={searchFilter.page}
												shape="circular"
												color="primary"
												onChange={paginationHandler}
												disabled={getProductsLoading}
												sx={{
													'& .MuiPaginationItem-root': {
														borderRadius: '12px',
														fontWeight: 600,
														fontFamily: 'inherit',
														fontSize: '14px',
														transition: 'all 0.2s ease',
													},
													'& .Mui-selected': {
														background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
														color: '#fff',
														'&:hover': {
															background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
														},
													},
												}}
											/>
											<Typography className="pagination-info">
												Total {totalCount} product{totalCount !== 1 ? 's' : ''}
											</Typography>
										</Stack>
									)}
								</>
							)}
						</Stack>
					</Stack>
				</Stack>

				{/* Floating Action Button - Sell Item */}
				<Fab
					className="sell-item-fab"
					color="primary"
					aria-label="sell item"
					onClick={handleSellItemClick}
					sx={{
						position: 'fixed',
						bottom: 42,
						right: 42,
						width: 64,
						height: 64,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
						zIndex: 1000,
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						'&:hover': {
							background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
							boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
							transform: 'translateY(-4px) scale(1.05)',
						},
						'&:active': {
							transform: 'translateY(-2px) scale(1.02)',
						},
					}}
				>
					<AddRoundedIcon sx={{ fontSize: 32, color: '#fff' }} />
				</Fab>
			</div>
		);
	}
};

MarketplaceList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 500000000,
			},
		},
	},
};

export default withLayoutMain(MarketplaceList);
