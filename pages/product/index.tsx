import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Button, Pagination, Stack, Typography, Menu, MenuItem } from '@mui/material';
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
	const [filterSortName, setFilterSortName] = useState('New');
	const [showFilter, setShowFilter] = useState(true);

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
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list || []);
			setTotalCount(data?.getProducts?.metaCounter[0]?.total || 0);
		},
	});

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

			// Optimistic update - like qilishdan oldin UI ni yangilash
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
				})
			);

			// Backend request
			await likeTargetProduct({
				variables: { input: id },
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			// Error bo'lsa, eski holatga qaytarish
			await getProductsRefetch({ input: searchFilter });
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const saveProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// Optimistic update - save qilishdan oldin UI ni yangilash
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
				})
			);

			// Backend request
			await saveTargetProduct({
				variables: { input: id },
			});

			await sweetTopSmallSuccessAlert('Saved successfully!', 800);
		} catch (err: any) {
			console.log('ERROR, saveProductHandler:', err.message);
			// Error bo'lsa, eski holatga qaytarish
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
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
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
							<Typography className="page-title">Marketplace</Typography>
							<Typography className="page-subtitle">Discover great deals from fellow students</Typography>
						</Stack>
						<Stack className="header-right">
							<Button
								className="filter-toggle-btn"
								startIcon={<TuneRoundedIcon />}
								onClick={() => setShowFilter(!showFilter)}
							>
								{showFilter ? 'Hide Filters' : 'Show Filters'}
							</Button>
							<Stack className="sort-box">
								<Typography className="sort-label">Sort by</Typography>
								<Button className="sort-btn" onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{filterSortName}
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
										New
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
										Lowest Price
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
										Highest Price
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
												<Typography>No Products found!</Typography>
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

									{/* Updated Pagination - Article Style */}
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
												Total{' '} {totalCount} product{totalCount !== 1 ? 's' : ''}
											</Typography>
										</Stack>
									)}
								</>
							)}
						</Stack>
					</Stack>
				</Stack>
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