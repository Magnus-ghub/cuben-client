import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
	Box,
	Stack,
	Button,
	Chip,
	Avatar,
	IconButton,
	Typography,
	TextField,
	FormControl,
	Select,
	MenuItem,
	InputAdornment,
} from '@mui/material';
import { X, Package, Send, Image as ImageIcon, Tag, Info, DollarSign } from 'lucide-react';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useReactiveVar, useMutation } from '@apollo/client';
import { getJwtToken } from '../../libs/auth';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../libs/apollo/store';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import { ProductCondition, ProductType } from '../../libs/enums/product.enum';
import { CREATE_PRODUCT } from '../../libs/apollo/user/mutation';
import { ProductInput } from '../../libs/types/product/product.input';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ListItem: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const inputRef = useRef<any>(null);

	// Form State
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);

	/** APOLLO REQUESTS **/
	const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return false;
			if (selectedFiles.length > 4) throw new Error('Cannot upload more than 4 images!');

			// Dinamik files va map (estate loyihasidagi kabi)
			const numFiles = selectedFiles.length;
			const filesArray = Array(4).fill(null);
			const mapObj: any = {};
			for (let i = 0; i < 4; i++) {
				mapObj[i] = [`variables.files.${i}`];
			}

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: filesArray,
						target: 'product',
					},
				}),
			);

			formData.append('map', JSON.stringify(mapObj));

			for (let i = 0; i < numFiles; i++) {
				formData.append(i.toString(), selectedFiles[i]);
			}

			// AUTH HEADER (estate loyihasidagi kabi)
			const token = getJwtToken();
			if (!token) throw new Error('Please log in to upload images');

			const response = await axios.post(
				`${process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						'apollo-require-preflight': true,
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.data.data?.imagesUploader) {
				throw new Error('Upload failed: No images returned');
			}

			const responseImages = response.data.data.imagesUploader.filter((url: string) => url); // Null'larni filter
			console.log('+responseImages: ', responseImages);

			// Eski + yangi images
			const newImages = [...(insertProductData.productImages || []), ...responseImages];
			setInsertProductData({ ...insertProductData, productImages: newImages });

			await sweetMixinSuccessAlert('Images uploaded successfully!');

			inputRef.current.value = ''; // Reset
		} catch (err: any) {
			console.log('err: ', err.message || err);
			await sweetMixinErrorAlert(err.message || 'Upload failed');
			if (inputRef.current) inputRef.current.value = '';
		}
	}

	// Remove image funksiyasi (estate loyihasidagi kabi)
	const removeImage = (index: number) => {
		const newImages = insertProductData.productImages.filter((_: any, i: number) => i !== index);
		setInsertProductData({ ...insertProductData, productImages: newImages });
	};

	const doDisabledCheck = () => {
		if (
			insertProductData.productName === '' ||
			insertProductData.productPrice === 0 || // @ts-ignore
			insertProductData.productType === '' || // @ts-ignore
			insertProductData.productCondition === '' ||
			insertProductData.productDesc === ''
		) {
			return true;
		}
		return false;
	};

	const insertProductHandler = useCallback(async () => {
		try {
			await createProduct({
				variables: { input: insertProductData },
			});
			await sweetMixinSuccessAlert('Product has been created successfully');
			router.push('/product');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertProductData]);

	console.log('+insertProductData', insertProductData);

	if (device === 'mobile') {
		return <div>LIST ITEM MOBILE</div>;
	}

	const productTypes = [
		{ value: ProductType.EDU, label: '📚 Books & Textbooks' },
		{ value: ProductType.TECH, label: '💻 Electronics' },
		{ value: ProductType.STYLE, label: '👕 Fashion & Clothing' },
		{ value: ProductType.HOME, label: '🏠 Home & Living' },
		{ value: ProductType.SERVICE, label: '⚙️ Services' },
		{ value: ProductType.OTHER, label: '📦 Other' },
	];

	const conditions = [
		{ value: ProductCondition.NEW, label: 'Brand New' },
		{ value: ProductCondition.LIKE_NEW, label: 'Like New' },
		{ value: ProductCondition.GOOD, label: 'Good' },
		{ value: ProductCondition.USED, label: 'Used' },
		{ value: ProductCondition.BAD, label: 'Needs Repair' },
	];

	return (
		<Box className="list-item-page">
			{/* Header (estate loyihasidagi kabi) */}
			<Box className="page-header">
				<Box className="header-content">
					<Box className="header-icon">
						<Package size={24} />
					</Box>
					<Box>
						<Typography variant="h4">List an Item</Typography>
						<Typography variant="body2">Sell your items to the community</Typography>
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
						<Avatar src={user?.memberImage || '/img/profile/defaultUser.svg'} className="seller-avatar" />
						<Box className="seller-info">
							<Typography variant="h6">{user?.memberNick || 'Seller'}</Typography>
							<Typography variant="body2">@{user?.memberNick?.toLowerCase() || 'user'}</Typography>
						</Box>
						<Chip icon={<Tag size={14} />} label="Selling on Marketplace" className="selling-chip" />
					</Box>

					{/* Product Type */}
					<Box className="form-group">
						<label className="form-label">Product Category</label>
						<FormControl fullWidth>
							<Select
								value={insertProductData.productType || 'select'}
								onChange={({ target: { value } }) =>
									setInsertProductData({ ...insertProductData, productType: value as ProductType })
								}
								className="select-input"
							>
								<MenuItem disabled value="select">
									Select Category
								</MenuItem>
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
						<label className="form-label">Product Name</label>
						<TextField
							fullWidth
							placeholder="e.g., MacBook Pro 2023, Calculus Textbook..."
							value={insertProductData.productName}
							onChange={({ target: { value } }) => setInsertProductData({ ...insertProductData, productName: value })}
							className="text-input"
						/>
					</Box>

					{/* Price and Condition Row (two-column-row ga o'zgartirildi) */}
					<Stack className="two-column-row">
						<Box className="form-group">
							<label className="form-label">Price (KRW)</label>
							<TextField
								fullWidth
								placeholder="Enter price"
								value={insertProductData.productPrice || ''}
								onChange={({ target: { value } }) =>
									setInsertProductData({ ...insertProductData, productPrice: parseInt(value) || 0 })
								}
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
							<label className="form-label">Condition</label>
							<FormControl fullWidth>
								<Select
									value={insertProductData.productCondition || 'select'}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productCondition: value as ProductCondition })
									}
									className="select-input"
								>
									<MenuItem disabled value="select">
										Select Condition
									</MenuItem>
									{conditions.map((cond) => (
										<MenuItem key={cond.value} value={cond.value}>
											{cond.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Stack>

					{/* Pickup Location - OPTIONAL */}
					<Box className="form-group">
						<label className="form-label">
							Pickup Location (Optional)
							<span className="char-count">{(insertProductData.productAddress || '').length}/500</span>
						</label>
						<TextField
							fullWidth
							multiline
							placeholder="Pickup location (optional): campus, nearby station, or area"
							value={insertProductData.productAddress || ''}
							onChange={({ target: { value } }) =>
								setInsertProductData({ ...insertProductData, productAddress: value })
							}
							className="text-input"
							inputProps={{ maxLength: 500 }}
						/>
					</Box>

					{/* Description */}
					<Box className="form-group">
						<label className="form-label">
							Description
							<span className="char-count">{(insertProductData.productDesc || '').length}/500</span>
						</label>
						<TextField
							fullWidth
							multiline
							placeholder="Describe your item: condition, features, reason for selling..."
							value={insertProductData.productDesc || ''}
							onChange={({ target: { value } }) => setInsertProductData({ ...insertProductData, productDesc: value })}
							className="text-input"
							inputProps={{ maxLength: 500 }}
						/>
					</Box>

					{/* Image Upload (images-grid ga o'zgartirildi, estate loyihasidagi kabi) */}
					{/* Image Upload */}
					<Box className="form-group">
						<label className="form-label">
							Product Images (Optional)
							<span className="char-count">{insertProductData.productImages?.length || 0}/4</span>
						</label>

						<Stack className="images-box">
							{' '}
							{/* images-grid o'rniga images-box */}
							{/* Upload Box - Kichik card */}
							<Stack className="upload-box" onClick={() => inputRef.current?.click()}>
								{' '}
								{/* Hover uchun onClick qo'shildi */}
								<ImageIcon size={20} /> {/* Kichikroq icon */}
								<p>Add Photos</p> {/* Kompakt text */}
								<input
									ref={inputRef}
									type="file"
									accept="image/jpg, image/jpeg, image/png"
									multiple
									onChange={uploadImages}
									style={{ display: 'none' }}
									id="product-images-upload"
								/>
							</Stack>
							{/* Gallery */}
							{insertProductData.productImages && insertProductData.productImages.length > 0 && (
								<Stack className="gallery-box">
									{' '}
									{/* image-preview o'rniga image-box */}
									{insertProductData.productImages.map((image: string, index: number) => {
										const imagePath: string = `${REACT_APP_API_URL}/${image}`;
										return (
											<Stack key={index} className="image-box">
												{' '}
												{/* image-preview o'rniga */}
												<img src={imagePath} alt={`Product ${index + 1}`} />
												<IconButton
													className="remove-img-btn" // SCSS'da style qo'shildi
													onClick={() => removeImage(index)}
												>
													<X size={16} />
												</IconButton>
												{index === 0 && <Chip label="Cover" size="small" className="cover-chip" />}
											</Stack>
										);
									})}
								</Stack>
							)}
						</Stack>
					</Box>

					{/* Submit Button */}
					<Box className="submit-section">
						<Button
							variant="contained"
							className="submit-btn"
							startIcon={<Send size={18} />}
							onClick={insertProductHandler}
							disabled={loading || doDisabledCheck()}
							fullWidth
						>
							{loading ? 'Publishing...' : 'List Product for Sale'}
						</Button>
					</Box>
				</Box>

				{/* Sidebar Tips */}
				<Box className="sidebar-card">
					<Typography variant="h6">💡 Listing Tips</Typography>
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
							<Typography variant="subtitle2">Safe Trading</Typography>
							<Typography variant="caption">Meet in public places on campus. Check items before payment.</Typography>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Box>
	);
};

ListItem.defaultProps = {
	initialValues: {
		productName: '',
		productPrice: 0,
		productType: '',
		productCondition: '',
		productAddress: '',
		productDesc: '',
		productImages: [],
	},
};

export default withLayoutMain(ListItem);
