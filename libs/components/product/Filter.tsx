import React, { useCallback, useState } from 'react';
import {
	IconButton,
	OutlinedInput,
	Typography,
	Checkbox,
	Button,
	Stack,
	Tooltip,
	Collapse,
	Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import router from 'next/router';
import { ProductsInquiry } from '../../types/product/product.input';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const device = useDeviceDetect();
	const { searchFilter, setSearchFilter, initialInput } = props;
	const [searchText, setSearchText] = useState('');
	const [productPrice, setProductPrice] = useState({
		start: 0,
		end: 500000,
	});
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
	
	// Expand/Collapse states
	const [expandType, setExpandType] = useState(true);
	const [expandLocation, setExpandLocation] = useState(true);
	const [expandCondition, setExpandCondition] = useState(true);
	const [expandPrice, setExpandPrice] = useState(true);

	// Product types
	const productTypes = ['BOOK', 'NOTE', 'ELECTRONIC', 'FASHION', 'ACCESSORY', 'HOME', 'SERVICE', 'OTHER'];
	
	// Locations
	const locations = [
		'DORMITORY',
		'MAIN_GATE',
		'LIBRARY',
		'CAFETERIA',
		'SPORT_CENTER',
		'STUDENT_CENTER',
		'BUS_STOP',
		'OTHER',
	];
	
	// Conditions
	const conditions = ['NEW', 'LIKE_NEW', 'GOOD', 'USED', 'BAD'];

	/** HANDLERS **/
	const handleReset = () => {
		setSearchText('');
		setProductPrice({ start: 0, end: 500000 });
		setSelectedTypes([]);
		setSelectedLocations([]);
		setSelectedConditions([]);
	};

	const handleTypeChange = (type: string) => {
		setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
	};

	const handleLocationChange = (location: string) => {
		setSelectedLocations((prev) =>
			prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
		);
	};

	const handleConditionChange = (condition: string) => {
		setSelectedConditions((prev) =>
			prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
		);
	};

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type === 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false }
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false }
				);
			}
		},
		[searchFilter]
	);

	const formatLabel = (text: string) => {
		return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const getTotalActiveFilters = () => {
		return selectedTypes.length + selectedLocations.length + selectedConditions.length;
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
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

			{/* Search Input */}
			<Stack className="filter-section">
				<Stack className="search-wrapper">
					<SearchIcon className="search-icon" />
					<input
						type="text"
						value={searchText}
						className="search-input"
						placeholder="Search products..."
						onChange={(e) => setSearchText(e.target.value)}
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

			{/* Location Filter */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandLocation(!expandLocation)}
					fullWidth
				>
					<Typography className="section-title">Location</Typography>
					{selectedLocations.length > 0 && (
						<Chip label={selectedLocations.length} size="small" className="count-chip" />
					)}
					<ExpandMoreIcon
						sx={{
							transform: expandLocation ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 0.3s ease',
						}}
					/>
				</Button>
				<Collapse in={expandLocation}>
					<Stack className="options-list">
						{locations.map((location) => (
							<Stack className="option-item" key={location}>
								<Checkbox
									id={location}
									size="small"
									checked={selectedLocations.includes(location)}
									onChange={() => handleLocationChange(location)}
								/>
								<label htmlFor={location}>
									<Typography className="option-label">{formatLabel(location)}</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Collapse>
			</Stack>

			{/* Condition Filter */}
			<Stack className="filter-section">
				<Button
					className="section-header"
					onClick={() => setExpandCondition(!expandCondition)}
					fullWidth
				>
					<Typography className="section-title">Condition</Typography>
					{selectedConditions.length > 0 && (
						<Chip label={selectedConditions.length} size="small" className="count-chip" />
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
						{conditions.map((condition) => (
							<Stack className="option-item" key={condition}>
								<Checkbox
									id={condition}
									size="small"
									checked={selectedConditions.includes(condition)}
									onChange={() => handleConditionChange(condition)}
								/>
								<label htmlFor={condition}>
									<Typography className="option-label">{formatLabel(condition)}</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Collapse>
			</Stack>

			{/* Price Range Filter */}
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
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'start');
								}
							}}
							className="price-input"
						/>
						<Typography className="price-divider">—</Typography>
						<input
							type="number"
							placeholder="₩ Max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'end');
								}
							}}
							className="price-input"
						/>
					</Stack>
				</Collapse>
			</Stack>

			{/* Apply Button */}
			<Button variant="contained" fullWidth className="apply-btn">
				Apply Filters
			</Button>
		</Stack>
	);
};

export default Filter;