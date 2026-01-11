import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Box, Stack, Button, TextField, MenuItem, Select, FormControl, Chip, Avatar, IconButton, InputAdornment } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../libs/sweetAlert';
import { getJwtToken } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { 
	Package, 
	Upload, 
	Send, 
	X, 
	AlertCircle,
	DollarSign,
	MapPin,
	Star,
	Image as ImageIcon,
	Tag,
	Info,
} from 'lucide-react';
import { ProductCondition, ProductType } from '../../libs/enums/product.enum';
import { CREATE_PRODUCT } from '../../libs/apollo/user/mutation';

const ListItem: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	// Form State
	const [productType, setProductType] = useState<ProductType>(ProductType.OTHER);
	const [productCondition, setProductCondition] = useState<ProductCondition>(ProductCondition.GOOD);
	const [productAddress, setProductAddress] = useState<string>('');
	const [productName, setProductName] = useState<string>('');
	const [productPrice, setProductPrice] = useState<string>('');
	const [productDescription, setProductDescription] = useState<string>('');
	const [productImages, setProductImages] = useState<string[]>([]);
	const [uploadingImages, setUploadingImages] = useState<boolean>(false);

	// Validation State
	const [errors, setErrors] = useState({
		name: '',
		price: '',
		description: '',
		images: '',
	});

	/** APOLLO REQUESTS **/
	const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);

	/** HANDLERS **/
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			// Max 5 images
			if (productImages.length + files.length > 5) {
				await sweetErrorHandling(new Error('Maximum 5 images allowed'));
				return;
			}

			setUploadingImages(true);

			const uploadPromises = Array.from(files).map(async (file) => {
				// Validate size (5MB)
				if (file.size > 5 * 1024 * 1024) {
					throw new Error('Each image should be less than 5MB');
				}

				const formData = new FormData();
				formData.append('image', file);

				const token = getJwtToken();
				const response = await axios.post(`${REACT_APP_API_URL}/upload`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				});

				return response.data.url;
			});

			const uploadedUrls = await Promise.all(uploadPromises);
			setProductImages([...productImages, ...uploadedUrls]);
			await sweetTopSuccessAlert('Images uploaded successfully!', 2000);
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setUploadingImages(false);
		}
	};

	const removeImage = (index: number) => {
		setProductImages(productImages.filter((_, i) => i !== index));
	};

	const validateForm = (): boolean => {
		const newErrors = { name: '', price: '', description: '', images: '' };

		if (!productName.trim()) {
			newErrors.name = 'Product name is required';
		} else if (productName.length < 3) {
			newErrors.name = 'Name must be at least 3 characters';
		}

		if (!productPrice.trim()) {
			newErrors.price = 'Price is required';
		} else if (isNaN(Number(productPrice)) || Number(productPrice) <= 0) {
			newErrors.price = 'Please enter a valid price';
		}

		if (!productDescription.trim()) {
			newErrors.description = 'Description is required';
		} else if (productDescription.length < 10) {
			newErrors.description = 'Description must be at least 10 characters';
		}

		if (productImages.length === 0) {
			newErrors.images = 'At least one image is required';
		}

		setErrors(newErrors);
		return !newErrors.name && !newErrors.price && !newErrors.description && !newErrors.images;
	};

	const handleSubmit = async () => {
		try {
			if (!validateForm()) return;

			await createProduct({
				variables: {
					input: {
						productType,
						productCondition,
						productAddress,
						productName,
						productPrice: Number(productPrice),
						productDescription,
						productImages,
					},
				},
			});

			await sweetTopSuccessAlert('Product listed successfully!', 2000);
			router.push('/marketplace');
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>LIST ITEM MOBILE</div>;
	}

	const productTypes = [
		{ value: ProductType.EDU, label: '📚 Books & Textbooks', icon: '📚' },
		{ value: ProductType.TECH, label: '💻 Electronics', icon: '💻' },
		{ value: ProductType.STYLE, label: '👕 Fashion & Clothing', icon: '👕' },
		{ value: ProductType.HOME, label: '🏠 Home & Living', icon: '🏠' },
		{ value: ProductType.SERVICE, label: '⚙️ Services', icon: '⚙️' },
		{ value: ProductType.OTHER, label: '📦 Other', icon: '📦' },
	];

	const conditions = [
		{ value: ProductCondition.NEW, label: '✨ Brand New', color: '#10b981' },
		{ value: ProductCondition.LIKE_NEW, label: '⭐ Like New', color: '#3b82f6' },
		{ value: ProductCondition.GOOD, label: '👍 Good', color: '#f59e0b' },
		{ value: ProductCondition.USED, label: '🔄 Used', color: '#94a3b8' },
		{ value: ProductCondition.BAD, label: '⚠️ Needs Repair', color: '#ef4444' },
	];

	return (
		<Box className="list-item-page">
			{/* Header */}
			<Box className="page-header">
				<Box className="header-content">
					<Box className="header-icon">
						<Package size={24} />
					</Box>
					<Box>
						<h1>List an Item</h1>
						<p>Sell your items to the community</p>
					</Box>
				</Box>
				<IconButton className="close-btn" onClick={() => router.back()}>
					<X size={20} />
				</IconButton>
			</Box>

			<Stack className="content-wrapper">
				{/* Main Form Card */}
				<Box className="main-form-card">
					{/* Seller Section */}
					<Box className="seller-section">
						<Avatar 
							src={user?.memberImage || '/img/profile/defaultUser.svg'} 
							className="seller-avatar"
						/>
						<Box className="seller-info">
							<h3>{user?.memberNick || 'Seller'}</h3>
							<p>@{user?.memberNick?.toLowerCase() || 'user'}</p>
						</Box>
						<Chip 
							icon={<Tag size={14} />}
							label="Selling on Marketplace" 
							className="selling-chip"
						/>
					</Box>

					{/* Product Type */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📦</span>
							Product Category
						</label>
						<FormControl fullWidth>
							<Select
								value={productType}
								onChange={(e) => setProductType(e.target.value as ProductType)}
								className="select-input"
							>
								{productTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					{/* Product Name */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">✏️</span>
							Product Name
						</label>
						<TextField
							fullWidth
							placeholder="e.g., MacBook Pro 2023, Calculus Textbook..."
							value={productName}
							onChange={(e) => setProductName(e.target.value)}
							error={!!errors.name}
							helperText={errors.name}
							className="text-input"
						/>
					</Box>

					{/* Price and Condition Row */}
					<Stack className="two-column-row">
						<Box className="form-group">
							<label className="form-label">
								<span className="emoji">💰</span>
								Price (KRW)
							</label>
							<TextField
								fullWidth
								placeholder="Enter price"
								value={productPrice}
								onChange={(e) => setProductPrice(e.target.value)}
								error={!!errors.price}
								helperText={errors.price}
								className="text-input"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<DollarSign size={18} />
										</InputAdornment>
									),
								}}
							/>
						</Box>

						<Box className="form-group">
							<label className="form-label">
								<span className="emoji">⭐</span>
								Condition
							</label>
							<FormControl fullWidth>
								<Select
									value={productCondition}
									onChange={(e) => setProductCondition(e.target.value as ProductCondition)}
									className="select-input"
								>
									{conditions.map((cond) => (
										<MenuItem key={cond.value} value={cond.value}>
											{cond.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Stack>

					{/* Location */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📍</span>
							Pickup Location
						</label>
						<FormControl fullWidth>
							{/* <Select
								value={productAddress}
								onChange={(e) 
								className="select-input"
							>
								{locations.map((loc) => (
									<MenuItem key={loc.value} value={loc.value}>
										{loc.label}
									</MenuItem>
								))}
							</Select> */}
						</FormControl>
					</Box>

					{/* Description */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📝</span>
							Description
							<span className="char-count">{productDescription.length}/500</span>
						</label>
						<TextField
							fullWidth
							multiline
							rows={6}
							placeholder="Describe your item: condition, features, reason for selling..."
							value={productDescription}
							onChange={(e) => setProductDescription(e.target.value)}
							error={!!errors.description}
							helperText={errors.description}
							className="text-input"
							inputProps={{ maxLength: 500 }}
						/>
					</Box>

					{/* Image Upload */}
					<Box className="form-group">
						<label className="form-label">
							<span className="emoji">📷</span>
							Product Images
							<span className="char-count">{productImages.length}/5</span>
						</label>
						
						{/* Image Grid */}
						<Box className="images-grid">
							{productImages.map((image, index) => (
								<Box key={index} className="image-preview">
									<img src={`${REACT_APP_API_URL}/${image}`} alt={`Product ${index + 1}`} />
									<IconButton 
										className="remove-img-btn"
										onClick={() => removeImage(index)}
									>
										<X size={16} />
									</IconButton>
									{index === 0 && <Chip label="Cover" size="small" className="cover-chip" />}
								</Box>
							))}
							
							{productImages.length < 5 && (
								<Box className="upload-box">
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageUpload}
										style={{ display: 'none' }}
										id="images-upload"
										disabled={uploadingImages}
									/>
									<label htmlFor="images-upload" className="upload-label">
										<ImageIcon size={32} />
										<p>{uploadingImages ? 'Uploading...' : 'Add Photos'}</p>
									</label>
								</Box>
							)}
						</Box>
						{errors.images && (
							<Box className="error-msg">
								<AlertCircle size={14} />
								<span>{errors.images}</span>
							</Box>
						)}
					</Box>

					{/* Submit Button */}
					<Box className="submit-section">
						<Button
							variant="contained"
							className="submit-btn"
							startIcon={<Send size={18} />}
							onClick={handleSubmit}
							disabled={loading || uploadingImages}
							fullWidth
						>
							{loading ? 'Publishing...' : 'List Product for Sale'}
						</Button>
					</Box>
				</Box>

				{/* Sidebar Tips */}
				<Box className="sidebar-card">
					<h3>💡 Listing Tips</h3>
					<ul>
						<li>Add clear photos from multiple angles</li>
						<li>Be honest about item condition</li>
						<li>Set a fair and competitive price</li>
						<li>Include all important details</li>
						<li>Respond quickly to inquiries</li>
					</ul>

					<Box className="info-box">
						<Info size={18} />
						<Box>
							<h4>Safe Trading</h4>
							<p>Meet in public places on campus. Check items before payment.</p>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
};

export default withLayoutMain(ListItem);