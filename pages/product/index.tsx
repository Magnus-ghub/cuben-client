import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Button, Pagination, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { NextPage } from 'next';
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import ProductCard from '../../libs/components/product/ProductCard';
import Filter from '../../libs/components/product/Filter';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { useRouter } from 'next/router';
import { Direction } from '../../libs/enums/common.enum';

const MarketplaceList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [products, setProducts] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	const [total, setTotal] = useState<number>(245);
	const [showFilter, setShowFilter] = useState(true);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		initialInput || {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		}
	);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			try {
				const inputObj = JSON.parse(router?.query?.input as string);
				setSearchFilter(inputObj);
				setCurrentPage(inputObj.page || 1);
			} catch (err) {
				console.error('Error parsing router query:', err);
			}
		} else {
			setCurrentPage(searchFilter?.page || 1);
		}
	}, [router]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const newFilter = { ...searchFilter, page: value };
		setSearchFilter(newFilter);
		setCurrentPage(value);
		
		await router.push(
			`/marketplace?input=${JSON.stringify(newFilter)}`,
			`/marketplace?input=${JSON.stringify(newFilter)}`,
			{ scroll: false }
		);
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
		let newFilter = { ...searchFilter };
		
		switch (e.currentTarget.id) {
			case 'new':
				newFilter = { ...searchFilter, sort: 'createdAt', direction: Direction.DESC };
				setFilterSortName('New');
				break;
			case 'lowest':
				newFilter = { ...searchFilter, sort: 'productPrice', direction: Direction.ASC };
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				newFilter = { ...searchFilter, sort: 'productPrice', direction: Direction.DESC };
				setFilterSortName('Highest Price');
				break;
		}
		
		setSearchFilter(newFilter);
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
								<Button 
									className="sort-btn"
									onClick={sortingClickHandler} 
									endIcon={<KeyboardArrowDownRoundedIcon />}
								>
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
										}
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
												backgroundColor: '#f9fafb'
											}
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
												backgroundColor: '#f9fafb'
											}
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
												backgroundColor: '#f9fafb'
											}
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
								<Filter 
									searchFilter={searchFilter} 
									setSearchFilter={setSearchFilter} 
									initialInput={initialInput} 
								/>
							</Stack>
						)}

						{/* Products Grid */}
						<Stack className="products-container">
							<Stack className="products-grid">
								{products.length === 0 ? (
									<Stack className="no-data">
										<img src="/img/icons/icoAlert.svg" alt="" />
										<Typography>No Products found!</Typography>
									</Stack>
								) : (
									products.map((product, index) => (
										<ProductCard key={index} />
									))
								)}
							</Stack>

							{/* Pagination */}
							{products.length !== 0 && (
								<Stack className="pagination-wrapper">
									<Stack className="pagination-info">
										<Typography className="result-count">
											Showing <strong>{(currentPage - 1) * searchFilter.limit + 1}-{Math.min(currentPage * searchFilter.limit, total)}</strong> of <strong>{total}</strong> products
										</Typography>
									</Stack>
									<Stack className="pagination-controls">
										<Pagination 
											page={currentPage} 
											count={Math.ceil(total / searchFilter.limit)} 
											shape="rounded" 
											color="primary" 
											size="large"
											onChange={handlePaginationChange}
										/>
									</Stack>
								</Stack>
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
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 500000,
			},
		},
	},
};

export default withLayoutMain(MarketplaceList);