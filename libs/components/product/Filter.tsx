import React, { useCallback, useState, useEffect } from 'react';
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

	// Local states
	const [searchText, setSearchText] = useState<string>('');
	const [productPrice, setProductPrice] = useState({
		start: 0,
		end: 500000,
	});
	const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
	const [selectedCondition, setSelectedCondition] = useState<ProductCondition | null>(null);
	
	// Expand/Collapse states
	const [expandType, setExpandType] = useState(true);
	const [expandCondition, setExpandCondition] = useState(true);
	const [expandPrice, setExpandPrice] = useState(true);

	// Debounce timer
	const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

	// Product types from enum
	const productTypes: ProductType[] = [
		ProductType.EDU,
		ProductType.TECH,
		ProductType.STYLE,
		ProductType.HOME,
		ProductType.SERVICE,
		ProductType.OTHER,
	];
	
	// Conditions from enum
	const conditions: ProductCondition[] = [
		ProductCondition.NEW,
		ProductCondition.LIKE_NEW,
		ProductCondition.GOOD,
		ProductCondition.USED,
		ProductCondition.BAD,
	];

	/** LIFECYCLE - Initialize from URL **/
	useEffect(() => {
		if (searchFilter?.search) {
			setSearchText(searchFilter.search.text || '');
			setProductPrice({
				start: searchFilter.search.pricesRange?.start || 0,
				end: searchFilter.search.pricesRange?.end || 500000,
			});
			setSelectedTypes(searchFilter.search.typeList || []);
			setSelectedCondition(searchFilter.search.condition || null);
		}
	}, []);

	/** HANDLERS **/
	const handleReset = () => {
		// Reset all local states
		setSearchText('');
		setProductPrice({ start: 0, end: 500000 });
		setSelectedTypes([]);
		setSelectedCondition(null);

		// Reset filter
		const resetSearch: ProductSearch = {
			text: '',
			pricesRange: { start: 0, end: 500000 },
			typeList: [],
			condition: null,
		};
		
		const resetFilter: ProductsInquiry = {
			...initialInput,
			page: 1,
			search: resetSearch,
		};

		setSearchFilter(resetFilter);
		router.push(`/product?input=${JSON.stringify(resetFilter)}`, undefined, { scroll: false });
	};

	// Type checkbox handler
	const handleTypeChange = (type: ProductType) => {
		const newTypes = selectedTypes.includes(type)
			? selectedTypes.filter((t) => t !== type)
			: [...selectedTypes, type];
		
		setSelectedTypes(newTypes);
	};

	// Condition radio handler
	const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const condition = e.target.value as ProductCondition;
		setSelectedCondition(condition);
	};

	// Clear condition
	const clearCondition = () => {
		setSelectedCondition(null);
	};

	// Search with debounce
	const handleSearchChange = (value: string) => {
		setSearchText(value);

		// Clear previous timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		// Set new debounce timer
		const timer = setTimeout(() => {
			const updatedSearch: ProductSearch = {
				...searchFilter.search,
				text: value.trim(),
			};
			const updatedFilter: ProductsInquiry = {
				...searchFilter,
				page: 1,
				search: updatedSearch,
			};
			setSearchFilter(updatedFilter);
			router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
		}, 500); // 500ms debounce

		setDebounceTimer(timer);
	};

	// Price handler with debounce
	const productPriceHandler = useCallback(
		(value: string, type: 'start' | 'end') => {
			const numValue = parseInt(value) || 0;
			
			if (numValue < 0) return;

			const updatedPrices = type === 'start' 
				? { ...productPrice, start: numValue }
				: { ...productPrice, end: numValue };

			// Validate: start should not be greater than end
			if (type === 'start' && numValue > updatedPrices.end) {
				updatedPrices.end = numValue;
			}
			if (type === 'end' && numValue < updatedPrices.start) {
				updatedPrices.start = numValue;
			}

			setProductPrice(updatedPrices);

			// Clear previous timer
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Debounce price update
			const timer = setTimeout(() => {
				const updatedSearch: ProductSearch = {
					...searchFilter.search,
					pricesRange: updatedPrices,
				};
				const updatedFilter: ProductsInquiry = {
					...searchFilter,
					page: 1,
					search: updatedSearch,
				};
				setSearchFilter(updatedFilter);
				router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
			}, 800);

			setDebounceTimer(timer);
		},
		[productPrice, searchFilter, debounceTimer],
	);

	// Apply filters (for Type & Condition)
	const handleApplyFilters = () => {
		const updatedSearch: ProductSearch = {
			...searchFilter.search,
			typeList: selectedTypes.length > 0 ? selectedTypes : undefined,
			condition: selectedCondition || undefined,
		};

		const updatedFilter: ProductsInquiry = {
			...searchFilter,
			page: 1,
			search: updatedSearch,
		};

		setSearchFilter(updatedFilter);
		router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
	};

	// Format labels
	const formatLabel = (text: string) => {
		return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	// Count active filters
	const getTotalActiveFilters = () => {
		let count = 0;
		if (selectedTypes.length > 0) count += selectedTypes.length;
		if (selectedCondition) count += 1;
		if (searchText.trim()) count += 1;
		if (productPrice.start !== 0 || productPrice.end !== 500000) count += 1;
		return count;
	};

	// Format price
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('ko-KR').format(price);
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

			{/* Search Input (Real-time with debounce) */}
			<Stack className="filter-section">
				<Stack className="search-wrapper">
					<SearchIcon className="search-icon" />
					<input
						type="text"
						value={searchText}
						className="search-input"
						placeholder="Search products..."
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
				</Stack>
			</Stack>

			{/* Product Type Filter */}
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
									id={`type-${type}`}
									size="small"
									checked={selectedTypes.includes(type)}
									onChange={() => handleTypeChange(type)}
									sx={{
										color: '#667eea',
										'&.Mui-checked': {
											color: '#667eea',
										},
									}}
								/>
								<label htmlFor={`type-${type}`}>
									<Typography className="option-label">{formatLabel(type)}</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Collapse>
			</Stack>
			
			{/* Condition Filter (Single select) */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandCondition(!expandCondition)}
					fullWidth
				>
					<Typography className="section-title">Condition</Typography>
					{selectedCondition && (
						<Chip label="1" size="small" className="count-chip" />
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
							onChange={handleConditionChange}
						>
							{conditions.map((condition) => (
								<FormControlLabel
									key={condition}
									value={condition}
									control={
										<Radio 
											size="small"
											sx={{
												color: '#667eea',
												'&.Mui-checked': {
													color: '#667eea',
												},
											}}
										/>
									}
									label={<Typography className="option-label">{formatLabel(condition)}</Typography>}
									sx={{
										'& .MuiFormControlLabel-label': {
											fontSize: '14px',
										},
									}}
								/>
							))}
						</RadioGroup>
						{selectedCondition && (
							<Button
								size="small"
								onClick={clearCondition}
								sx={{
									mt: 1,
									fontSize: '12px',
									textTransform: 'none',
									color: '#667eea',
								}}
							>
								Clear condition
							</Button>
						)}
					</Stack>
				</Collapse>
			</Stack>

			{/* Price Range Filter (Real-time with debounce) */}
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
						<Stack sx={{ flex: 1 }}>
							<Typography className="price-label">Min</Typography>
							<input
								type="number"
								placeholder="₩ 0"
								min={0}
								value={productPrice.start}
								onChange={(e) => productPriceHandler(e.target.value, 'start')}
								className="price-input"
							/>
							<Typography className="price-display">₩{formatPrice(productPrice.start)}</Typography>
						</Stack>
						<Typography className="price-divider">—</Typography>
						<Stack sx={{ flex: 1 }}>
							<Typography className="price-label">Max</Typography>
							<input
								type="number"
								placeholder="₩ 500,000"
								min={0}
								value={productPrice.end}
								onChange={(e) => productPriceHandler(e.target.value, 'end')}
								className="price-input"
							/>
							<Typography className="price-display">₩{formatPrice(productPrice.end)}</Typography>
						</Stack>
					</Stack>
				</Collapse>
			</Stack>

			{/* Apply Button */}
			<Button 
				variant="contained" 
				fullWidth 
				className="apply-btn"
				onClick={handleApplyFilters}
				disabled={selectedTypes.length === 0 && !selectedCondition}
				sx={{
					mt: 2,
					py: 1.5,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '12px',
					fontWeight: 600,
					fontSize: '14px',
					textTransform: 'none',
					boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
					'&:hover': {
						background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
						boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
					},
					'&:disabled': {
						background: '#e5e7eb',
						color: '#9ca3af',
						boxShadow: 'none',
					},
				}}
			>
				Apply Type & Condition {selectedTypes.length > 0 || selectedCondition ? `(${(selectedTypes.length + (selectedCondition ? 1 : 0))})` : ''}
			</Button>

			{/* Active filters summary */}
			{getTotalActiveFilters() > 0 && (
				<Stack className="active-filters-summary" sx={{ mt: 2, gap: 1 }}>
					<Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: 0.5 }}>
						Active Filters:
					</Typography>
					{searchText.trim() && (
						<Chip
							label={`Search: "${searchText}"`}
							size="small"
							onDelete={() => handleSearchChange('')}
							sx={{ fontSize: '12px' }}
						/>
					)}
					{selectedTypes.map((type) => (
						<Chip
							key={type}
							label={formatLabel(type)}
							size="small"
							onDelete={() => {
								setSelectedTypes(selectedTypes.filter(t => t !== type));
							}}
							sx={{ fontSize: '12px' }}
						/>
					))}
					{selectedCondition && (
						<Chip
							label={formatLabel(selectedCondition)}
							size="small"
							onDelete={clearCondition}
							sx={{ fontSize: '12px' }}
						/>
					)}
					{(productPrice.start !== 0 || productPrice.end !== 500000) && (
						<Chip
							label={`₩${formatPrice(productPrice.start)} - ₩${formatPrice(productPrice.end)}`}
							size="small"
							onDelete={() => {
								setProductPrice({ start: 0, end: 500000 });
								productPriceHandler('0', 'start');
								productPriceHandler('500000', 'end');
							}}
							sx={{ fontSize: '12px' }}
						/>
					)}
				</Stack>
			)}
		</Stack>
	);
};

export default Filter;