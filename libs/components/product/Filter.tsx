import React, { useCallback, useState, useEffect } from 'react';
import {
	IconButton,
	Typography,
	Button,
	Stack,
	Tooltip,
	Collapse,
	Chip,
	Slider,
	Box,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import router from 'next/router';
import { ProductsInquiry, ProductSearch } from '../../types/product/product.input';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCondition, ProductType } from '../../enums/product.enum';
import { useTranslation } from 'react-i18next';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: React.Dispatch<React.SetStateAction<ProductsInquiry>>;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const device = useDeviceDetect();
	const { searchFilter, setSearchFilter, initialInput } = props;
	const [searchText, setSearchText] = useState<string>('');
	const [productPrice, setProductPrice] = useState<[number, number]>([0, 10000000]);
	const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
	const [selectedCondition, setSelectedCondition] = useState<ProductCondition | null>(null);
	const [expandType, setExpandType] = useState(false);
	const [expandCondition, setExpandCondition] = useState(false);
	const { t, i18n } = useTranslation('common');
	const [expandPrice, setExpandPrice] = useState(false);
	const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
	const productTypes: ProductType[] = [
		ProductType.EDU,
		ProductType.TECH,
		ProductType.STYLE,
		ProductType.HOME,
		ProductType.SERVICE,
		ProductType.OTHER,
	];

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
			setProductPrice([
				searchFilter.search.pricesRange?.start || 0,
				searchFilter.search.pricesRange?.end || 10000000,
			]);
			setSelectedTypes(searchFilter.search.typeList || []);
			setSelectedCondition(searchFilter.search.condition || null);
		}
	}, []);

	/** HANDLERS **/
	const handleReset = () => {
		setSearchText('');
		setProductPrice([0, 10000000]);
		setSelectedTypes([]);
		setSelectedCondition(null);

		const resetSearch: ProductSearch = {
			text: '',
			pricesRange: { start: 0, end: 10000000 },
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

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

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
		}, 500);

		setDebounceTimer(timer);
	};

	// Price slider handler with debounce
	const handlePriceChange = (event: Event, newValue: number | number[]) => {
		const value = newValue as [number, number];
		setProductPrice(value);
	};

	const handlePriceChangeCommitted = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
		const value = newValue as [number, number];

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		const timer = setTimeout(() => {
			const updatedSearch: ProductSearch = {
				...searchFilter.search,
				pricesRange: { start: value[0], end: value[1] },
			};
			const updatedFilter: ProductsInquiry = {
				...searchFilter,
				page: 1,
				search: updatedSearch,
			};
			setSearchFilter(updatedFilter);
			router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
		}, 300);

		setDebounceTimer(timer);
	};

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
		if (productPrice[0] !== 0 || productPrice[1] !== 10000000) count += 1;
		return count;
	};

	// Format price
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('ko-KR').format(price);
	};

	// Price marks for slider
	const priceMarks = [
		{ value: 0, label: '₩0' },
		{ value: 2500000, label: '₩2.5M' },
		{ value: 5000000, label: '₩5M' },
		{ value: 7500000, label: '₩7.5M' },
		{ value: 10000000, label: '₩10M' },
	];

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	}

	return (
		<Stack className="filter-modern-container">
			{/* Header */}
			<Stack className="filter-modern-header">
				<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
					<FilterListIcon sx={{ color: '#667eea', fontSize: 22 }} />
					<Typography className="filter-modern-title">{t('filters')}</Typography>
					{getTotalActiveFilters() > 0 && (
						<Chip label={getTotalActiveFilters()} size="small" className="active-filters-chip" />
					)}
				</Stack>
				<Tooltip title="Reset" arrow>
					<IconButton onClick={handleReset} className="reset-btn" size="small">
						<RefreshIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Stack>

			{/* Search Input */}
			<Stack className="filter-modern-section">
				<Stack className="search-wrapper-modern">
					<SearchIcon className="search-icon-modern" />
					<input
						type="text"
						value={searchText}
						className="search-input-modern"
						placeholder={t('searchProducts')}
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
				</Stack>
			</Stack>

			{/* Price Range Filter - Vertical Slider (Carrot.kr style) */}
			<Stack className="filter-modern-section">
				<Button className="section-header-modern" onClick={() => setExpandPrice(!expandPrice)} fullWidth>
					<Typography className="section-title-modern">{t('price_range')}</Typography>
					<ExpandMoreIcon
						sx={{
							transform: expandPrice ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
							fontSize: 20,
						}}
					/>
				</Button>
				<Collapse in={expandPrice}>
					<Box className="price-slider-container">
						<Stack sx={{ alignItems: 'center', gap: 2, py: 2 }}>
							<Stack sx={{ flexDirection: 'row', gap: 2, width: '100%', justifyContent: 'space-between' }}>
								<Stack sx={{ flex: 1, alignItems: 'center' }}>
									<Typography className="price-label-modern">Min</Typography>
									<Typography className="price-value-modern">₩{formatPrice(productPrice[0])}</Typography>
								</Stack>
								<Stack sx={{ flex: 1, alignItems: 'center' }}>
									<Typography className="price-label-modern">Max</Typography>
									<Typography className="price-value-modern">₩{formatPrice(productPrice[1])}</Typography>
								</Stack>
							</Stack>

							<Box sx={{ width: '100%', px: 1 }}>
								<Slider
									value={productPrice}
									onChange={handlePriceChange}
									onChangeCommitted={handlePriceChangeCommitted}
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => `₩${formatPrice(value)}`}
									min={0}
									max={10000000}
									step={100000}
									marks={priceMarks}
									sx={{
										color: '#667eea',
										height: 6,
										'& .MuiSlider-thumb': {
											width: 18,
											height: 18,
											backgroundColor: '#fff',
											border: '3px solid currentColor',
											'&:hover, &.Mui-focusVisible': {
												boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
											},
										},
										'& .MuiSlider-track': {
											height: 6,
											borderRadius: 3,
										},
										'& .MuiSlider-rail': {
											height: 6,
											borderRadius: 3,
											opacity: 0.3,
											backgroundColor: '#cbd5e1',
										},
										'& .MuiSlider-mark': {
											display: 'none',
										},
										'& .MuiSlider-markLabel': {
											fontSize: '10px',
											color: '#94a3b8',
											fontWeight: 500,
											top: 28,
										},
										'& .MuiSlider-valueLabel': {
											fontSize: 11,
											fontWeight: 600,
											top: -6,
											backgroundColor: '#667eea',
											borderRadius: 6,
											padding: '4px 8px',
										},
									}}
								/>
							</Box>
						</Stack>
					</Box>
				</Collapse>
			</Stack>

			{/* Product Type Filter - Compact Pills */}
			<Stack className="filter-modern-section">
				<Button className="section-header-modern" onClick={() => setExpandType(!expandType)} fullWidth>
					<Typography className="section-title-modern">{t('product_type')}</Typography>
					{selectedTypes.length > 0 && (
						<Chip label={selectedTypes.length} size="small" className="count-chip-modern" />
					)}
					<ExpandMoreIcon
						sx={{
							transform: expandType ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
							fontSize: 20,
						}}
					/>
				</Button>
				<Collapse in={expandType}>
					<Stack className="pill-container">
						{productTypes.map((type) => (
							<Chip
								key={type}
								label={formatLabel(type)}
								onClick={() => handleTypeChange(type)}
								className={`pill-chip ${selectedTypes.includes(type) ? 'pill-chip-selected' : ''}`}
								sx={{
									backgroundColor: selectedTypes.includes(type)
										? '#667eea'
										: 'transparent',
									color: selectedTypes.includes(type) ? '#fff' : '#64748b',
									border: `2px solid ${selectedTypes.includes(type) ? '#667eea' : '#e5e7eb'}`,
									fontWeight: 600,
									fontSize: '13px',
									height: '32px',
									'&:hover': {
										backgroundColor: selectedTypes.includes(type) ? '#5568d3' : '#f3f4f6',
										borderColor: selectedTypes.includes(type) ? '#5568d3' : '#cbd5e1',
									},
								}}
							/>
						))}
					</Stack>
				</Collapse>
			</Stack>

			{/* Condition Filter - Compact Pills */}
			<Stack className="filter-modern-section">
				<Button className="section-header-modern" onClick={() => setExpandCondition(!expandCondition)} fullWidth>
					<Typography className="section-title-modern">{t('condition')}</Typography>
					{selectedCondition && <Chip label="1" size="small" className="count-chip-modern" />}
					<ExpandMoreIcon
						sx={{
							transform: expandCondition ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
							fontSize: 20,
						}}
					/>
				</Button>
				<Collapse in={expandCondition}>
					<Stack className="pill-container">
						{conditions.map((condition) => (
							<Chip
								key={condition}
								label={formatLabel(condition)}
								onClick={() => {
									if (selectedCondition === condition) {
										setSelectedCondition(null);
									} else {
										setSelectedCondition(condition);
									}
								}}
								className={`pill-chip ${selectedCondition === condition ? 'pill-chip-selected' : ''}`}
								sx={{
									backgroundColor: selectedCondition === condition ? '#10b981' : 'transparent',
									color: selectedCondition === condition ? '#fff' : '#64748b',
									border: `2px solid ${selectedCondition === condition ? '#10b981' : '#e5e7eb'}`,
									fontWeight: 600,
									fontSize: '13px',
									height: '32px',
									'&:hover': {
										backgroundColor: selectedCondition === condition ? '#059669' : '#f3f4f6',
										borderColor: selectedCondition === condition ? '#059669' : '#cbd5e1',
									},
								}}
							/>
						))}
					</Stack>
				</Collapse>
			</Stack>

			{/* Apply Button */}
			<Button
				variant="contained"
				fullWidth
				className="apply-btn-modern"
				onClick={handleApplyFilters}
				disabled={selectedTypes.length === 0 && !selectedCondition}
				sx={{
					mt: 2,
					py: 1.2,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					borderRadius: '10px',
					fontWeight: 700,
					fontSize: '13px',
					textTransform: 'none',
					boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
					'&:hover': {
						background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
						boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)',
					},
					'&:disabled': {
						background: '#e5e7eb',
						color: '#9ca3af',
						boxShadow: 'none',
					},
				}}
			>
				{t('apply_filters')}
				{selectedTypes.length > 0 || selectedCondition ? ` (${selectedTypes.length + (selectedCondition ? 1 : 0)})` : ''}
			</Button>

			{/* Active filters summary - Compact */}
			{getTotalActiveFilters() > 0 && (
				<Stack className="active-filters-summary-modern" sx={{ mt: 2, gap: 1 }}>
					<Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
						Active ({getTotalActiveFilters()})
					</Typography>
					<Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0.75 }}>
						{searchText.trim() && (
							<Chip
								label={`"${searchText.length > 12 ? searchText.slice(0, 12) + '...' : searchText}"`}
								size="small"
								onDelete={() => handleSearchChange('')}
								sx={{
									fontSize: '11px',
									height: '24px',
									backgroundColor: '#f1f5f9',
									'& .MuiChip-deleteIcon': { fontSize: '14px' },
								}}
							/>
						)}
						{selectedTypes.map((type) => (
							<Chip
								key={type}
								label={formatLabel(type)}
								size="small"
								onDelete={() => {
									setSelectedTypes(selectedTypes.filter((t) => t !== type));
								}}
								sx={{
									fontSize: '11px',
									height: '24px',
									backgroundColor: '#f1f5f9',
									'& .MuiChip-deleteIcon': { fontSize: '14px' },
								}}
							/>
						))}
						{selectedCondition && (
							<Chip
								label={formatLabel(selectedCondition)}
								size="small"
								onDelete={clearCondition}
								sx={{
									fontSize: '11px',
									height: '24px',
									backgroundColor: '#f1f5f9',
									'& .MuiChip-deleteIcon': { fontSize: '14px' },
								}}
							/>
						)}
						{(productPrice[0] !== 0 || productPrice[1] !== 10000000) && (
							<Chip
								label={`₩${formatPrice(productPrice[0])} - ₩${formatPrice(productPrice[1])}`}
								size="small"
								onDelete={() => {
									setProductPrice([0, 10000000]);
									handlePriceChangeCommitted(new Event('change'), [0, 10000000]);
								}}
								sx={{
									fontSize: '11px',
									height: '24px',
									backgroundColor: '#f1f5f9',
									'& .MuiChip-deleteIcon': { fontSize: '14px' },
								}}
							/>
						)}
					</Stack>
				</Stack>
			)}
		</Stack>
	);
};

export default Filter;