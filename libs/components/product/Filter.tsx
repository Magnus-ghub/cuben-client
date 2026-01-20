import React, { useCallback, useState } from 'react';
import {
	IconButton,
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	Button,
	Stack,
	Tooltip,
	Collapse,
	Chip,
	Checkbox,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import router from 'next/router';
import { ProductsInquiry, ProductSearch } from '../../types/product/product.input'; 
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCondition, ProductType } from '../../enums/product.enum';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: React.Dispatch<React.SetStateAction<ProductsInquiry>>;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const device = useDeviceDetect();
	const { searchFilter, setSearchFilter, initialInput } = props;

	const [searchText, setSearchText] = useState(searchFilter?.search?.text || ''); 
	const [productPrice, setProductPrice] = useState({
		start: searchFilter?.search?.pricesRange?.start || 0,
		end: searchFilter?.search?.pricesRange?.end || 500000,
	});
	const [selectedTypes, setSelectedTypes] = useState<ProductType[]>(searchFilter?.search?.typeList || []); 
	const [selectedCondition, setSelectedCondition] = useState<ProductCondition | null>(searchFilter?.search?.condition || null); 
	const [selectedOptions, setSelectedOptions] = useState<string[]>(searchFilter?.search?.options || []); 
	
	// Expand/Collapse states
	const [expandType, setExpandType] = useState(true);
	const [expandOptions, setExpandOptions] = useState(true); 
	const [expandCondition, setExpandCondition] = useState(true);
	const [expandPrice, setExpandPrice] = useState(true);

	// Product types from enum
	const productTypes: ProductType[] = [
		ProductType.EDU,
		ProductType.TECH,
		ProductType.STYLE,
		ProductType.HOME,
		ProductType.SERVICE,
		ProductType.OTHER,
	];
	
	// Conditions from enum (single select)
	const conditions: ProductCondition[] = [
		ProductCondition.NEW,
		ProductCondition.LIKE_NEW,
		ProductCondition.GOOD,
		ProductCondition.USED,
		ProductCondition.BAD,
	];

	/** HANDLERS **/
	const handleReset = () => {
		const resetSearch: ProductSearch = {
			...initialInput.search,
			text: '',
			pricesRange: { start: 0, end: 500000 },
			typeList: [],
			condition: null,
			options: [],
		};
		const resetFilter: ProductsInquiry = {
			...initialInput,
			search: resetSearch,
		};
		setSearchFilter(resetFilter);
		setSearchText('');
		setProductPrice({ start: 0, end: 500000 });
		setSelectedTypes([]);
		setSelectedCondition(null);
		setSelectedOptions([]);
		router.push(`/product?input=${JSON.stringify(resetFilter)}`, undefined, { scroll: false });
	};

	const handleTypeChange = (type: ProductType) => {
		setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
	};

	const handleOptionChange = (option: string): void => {
		setSelectedOptions((prev) =>
			prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
		);
	};

	const handleConditionChange = (condition: ProductCondition) => {
		setSelectedCondition(condition); // Single value
	};

	const handleSearchChange = (value: string) => {
		setSearchText(value);
		const updatedSearch: ProductSearch = {
			...searchFilter.search,
			text: value,
		};
		const updatedFilter: ProductsInquiry = {
			...searchFilter,
			search: updatedSearch,
		};
		setSearchFilter(updatedFilter);
		router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
	};

	const productPriceHandler = useCallback(
		async (value: number, type: string) => {
			const numValue = parseInt(value.toString(), 10);
			if (isNaN(numValue) || numValue < 0) return;

			const updatedPrices = type === 'start' 
				? { ...productPrice, start: numValue }
				: { ...productPrice, end: numValue };

			setProductPrice(updatedPrices);

			const updatedSearch: ProductSearch = {
				...searchFilter.search,
				pricesRange: updatedPrices,
			};
			const updatedFilter: ProductsInquiry = {
				...searchFilter,
				search: updatedSearch,
			};
			setSearchFilter(updatedFilter);
			router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
		},
		[searchFilter, productPrice, setSearchFilter],
	);

	const handleApplyFilters = () => {
		const updatedSearch: ProductSearch = {
			...searchFilter.search,
			typeList: selectedTypes,
			condition: selectedCondition,
			options: selectedOptions,
		};
		const updatedFilter: ProductsInquiry = {
			...searchFilter,
			search: updatedSearch,
		};
		setSearchFilter(updatedFilter);
		router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
	};

	const formatLabel = (text: string) => {
		return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const getTotalActiveFilters = () => {
		return selectedTypes.length + selectedOptions.length + (selectedCondition ? 1 : 0);
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	}

	return (
		<Stack className="filter-container">
			{/* Header */}
			<Stack className="filter-header">
				<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
					<FilterListIcon sx={{ color: '#667eea', fontSize: 24 }} />
					<Typography className="filter-title">Filters</Typography>
				</Stack>
				<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
					{getTotalActiveFilters() > 0 && (
						<Chip
							label={getTotalActiveFilters()}
							size="small"
							className="active-filters-chip"
						/>
					)}
					<Tooltip title="Reset all filters" arrow>
						<IconButton onClick={handleReset} className="reset-btn" size="small">
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>

			{/* Search Input (Real-time apply - 'text' field) */}
			<Stack className="filter-section">
				<Stack className="search-wrapper">
					<SearchIcon className="search-icon" />
					<input
						type="text"
						value={searchText}
						className="search-input"
						placeholder="Search products..."
						onChange={(e) => handleSearchChange(e.target.value)} // Real-time
					/>
				</Stack>
			</Stack>

			{/* Product Type Filter ('typeList' array from enum) */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandType(!expandType)}
					fullWidth
				>
					<Typography className="section-title">Product Type</Typography>
					{selectedTypes.length > 0 && (
						<Chip label={selectedTypes.length} size="small" className="count-chip" />
					)}
					<ExpandMoreIcon
						sx={{
							transform: expandType ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</Button>
				<Collapse in={expandType}>
					<Stack className="options-list">
						{productTypes.map((type) => (
							<Stack className="option-item" key={type}>
								<Checkbox
									id={type}
									size="small"
									checked={selectedTypes.includes(type)}
									onChange={() => handleTypeChange(type)}
								/>
								<label htmlFor={type}>
									<Typography className="option-label">{formatLabel(type)}</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Collapse>
			</Stack>
			
			{/* Condition Filter (Single 'condition' from enum) */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandCondition(!expandCondition)}
					fullWidth
				>
					<Typography className="section-title">Condition</Typography>
					{selectedCondition && (
						<Chip label={1} size="small" className="count-chip" />
					)}
					<ExpandMoreIcon
						sx={{
							transform: expandCondition ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</Button>
				<Collapse in={expandCondition}>
					<Stack className="options-list">
						<RadioGroup
							value={selectedCondition || ''}
							onChange={(e) => handleConditionChange(e.target.value as ProductCondition)}
						>
							{conditions.map((condition) => (
								<FormControlLabel
									key={condition}
									value={condition}
									control={<Radio size="small" />}
									label={<Typography className="option-label">{formatLabel(condition)}</Typography>}
								/>
							))}
						</RadioGroup>
					</Stack>
				</Collapse>
			</Stack>

			{/* Price Range Filter (Real-time apply - 'pricesRange') */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandPrice(!expandPrice)}
					fullWidth
				>
					<Typography className="section-title">Price Range</Typography>
					<ExpandMoreIcon
						sx={{
							transform: expandPrice ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</Button>
				<Collapse in={expandPrice}>
					<Stack className="price-inputs">
						<input
							type="number"
							placeholder="₩ Min"
							min={0}
							value={productPrice.start}
							onChange={(e: any) => productPriceHandler(parseInt(e.target.value) || 0, 'start')}
							className="price-input"
						/>
						<Typography className="price-divider">—</Typography>
						<input
							type="number"
							placeholder="₩ Max"
							value={productPrice.end}
							onChange={(e: any) => productPriceHandler(parseInt(e.target.value) || 500000, 'end')}
							className="price-input"
						/>
					</Stack>
				</Collapse>
			</Stack>

			{/* Apply Button */}
			<Button 
				variant="contained" 
				fullWidth 
				className="apply-btn"
				onClick={handleApplyFilters}
				disabled={getTotalActiveFilters() === 0}
			>
				Apply Filters ({getTotalActiveFilters() > 0 ? getTotalActiveFilters() : 0})
			</Button>
		</Stack>
	);
};

export default Filter;