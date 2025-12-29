import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { ProductInput } from '../../types/product/product.input';
import { ProductLocation, ProductType } from '../../enums/product.enum';
import { Upload, X, Image as ImageIcon, DollarSign, MapPin, Home, Bed, Maximize } from 'lucide-react';

const AddProduct = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertProductData, setInsertProductData] = useState<ProductInput>(initialValues);
	const [productType, setProductType] = useState<ProductType[]>(Object.values(ProductType));
	const [productLocation, setProductLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	let getProductData: any, getProductLoading: any;

	/** LIFECYCLES **/
	useEffect(() => {
		setInsertProductData({
			...insertProductData,
			productTitle: getProductData?.getProduct ? getProductData?.getProduct?.productTitle : '',
			productPrice: getProductData?.getProduct ? getProductData?.getProduct?.productPrice : 0,
			productType: getProductData?.getProduct ? getProductData?.getProduct?.productType : '',
			productLocation: getProductData?.getProduct ? getProductData?.getProduct?.productLocation : '',
			productAddress: getProductData?.getProduct ? getProductData?.getProduct?.productAddress : '',
			productDesc: getProductData?.getProduct ? getProductData?.getProduct?.productDesc : '',
			productImages: getProductData?.getProduct ? getProductData?.getProduct?.productImages : [],
		});
	}, [getProductLoading, getProductData]);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: [null, null, null, null, null],
						target: 'product',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;
			setInsertProductData({ ...insertProductData, productImages: responseImages });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}

	const removeImage = (indexToRemove: number) => {
		const updatedImages = insertProductData.productImages.filter((_, index) => index !== indexToRemove);
		setInsertProductData({ ...insertProductData, productImages: updatedImages });
	};

	const doDisabledCheck = () => {
		if (
			insertProductData.productTitle === '' ||
			insertProductData.productPrice === 0 ||
			!insertProductData.productType ||
			!insertProductData.productLocation ||
			insertProductData.productAddress === '' ||
			insertProductData.productDesc === '' ||
			insertProductData.productImages.length === 0
		) {
			return true;
		}
	};

	const insertProductHandler = useCallback(async () => {}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {}, [insertProductData]);

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>ADD NEW PRODUCT MOBILE PAGE</div>;
	} else {
		return (
			<div id="add-product-page">
				{/* Header Section */}
				<Stack className="page-header-section">
					<Stack className="header-content">
						<Typography className="page-title">
							{router.query.productId ? 'Edit Listing' : 'Create New Listing'}
						</Typography>
						<Typography className="page-subtitle">
							Fill in the details below to {router.query.productId ? 'update' : 'list'} your product
						</Typography>
					</Stack>
				</Stack>

				{/* Main Form Container */}
				<Stack className="form-container">
					{/* Basic Information Card */}
					<Stack className="form-card">
						<Stack className="card-header">
							<Home size={20} />
							<Typography className="card-title">Basic Information</Typography>
						</Stack>

						<Stack className="form-content">
							{/* Title */}
							<Stack className="form-group full-width">
								<Typography className="form-label">Product Title *</Typography>
								<input
									type="text"
									className="form-input"
									placeholder="Enter product title"
									value={insertProductData.productTitle}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productTitle: value })
									}
								/>
							</Stack>

							{/* Price & Type Row */}
							<Stack className="form-row">
								<Stack className="form-group">
									<Typography className="form-label">Price *</Typography>
									<div className="input-with-icon">
										<DollarSign size={18} className="input-icon" />
										<input
											type="number"
											className="form-input with-icon"
											placeholder="Enter price"
											value={insertProductData.productPrice}
											onChange={({ target: { value } }) =>
												setInsertProductData({ ...insertProductData, productPrice: parseInt(value) || 0 })
											}
										/>
									</div>
								</Stack>

								<Stack className="form-group">
									<Typography className="form-label">Product Type *</Typography>
									<select
										className="form-select"
										value={insertProductData.productType || ''}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productType: value as ProductType })
										}
									>
										<option value="" disabled>
											Select product type
										</option>
										{productType.map((type: any) => (
											<option value={type} key={type}>
												{type}
											</option>
										))}
									</select>
								</Stack>
							</Stack>

							{/* Location & Address Row */}
							<Stack className="form-row">
								<Stack className="form-group">
									<Typography className="form-label">Location *</Typography>
									<div className="input-with-icon">
										<MapPin size={18} className="input-icon" />
										<select
											className="form-select with-icon"
											value={insertProductData.productLocation || ''}
											onChange={({ target: { value } }) =>
												setInsertProductData({ ...insertProductData, productLocation: value as ProductLocation })
											}
										>
											<option value="" disabled>
												Select location
											</option>
											{productLocation.map((location: any) => (
												<option value={location} key={location}>
													{location}
												</option>
											))}
										</select>
									</div>
								</Stack>

								<Stack className="form-group">
									<Typography className="form-label">Address *</Typography>
									<input
										type="text"
										className="form-input"
										placeholder="Enter full address"
										value={insertProductData.productAddress}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productAddress: value })
										}
									/>
								</Stack>
							</Stack>

							{/* Options Row */}
							<Stack className="form-row">
								<Stack className="form-group">
									<Typography className="form-label">Barter Available</Typography>
									<select
										className="form-select"
										value={insertProductData.productBarter ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productBarter: value === 'yes' })
										}
									>
										<option value="no">No</option>
										<option value="yes">Yes</option>
									</select>
								</Stack>

								<Stack className="form-group">
									<Typography className="form-label">Available for Rent</Typography>
									<select
										className="form-select"
										value={insertProductData.productRent ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productRent: value === 'yes' })
										}
									>
										<option value="no">No</option>
										<option value="yes">Yes</option>
									</select>
								</Stack>
							</Stack>
						</Stack>
					</Stack>

					{/* Product Details Card */}
					<Stack className="form-card">
						<Stack className="card-header">
							<Maximize size={20} />
							<Typography className="card-title">Product Details</Typography>
						</Stack>

						<Stack className="form-content">
							<Stack className="form-row three-columns">
								<Stack className="form-group">
									<Typography className="form-label">Rooms *</Typography>
									<select
										className="form-select"
										value={insertProductData.productRooms || ''}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productRooms: parseInt(value) })
										}
									>
										<option value="" disabled>
											Select rooms
										</option>
										{[1, 2, 3, 4, 5, 6, 7, 8].map((room: number) => (
											<option value={room} key={room}>
												{room} {room === 1 ? 'Room' : 'Rooms'}
											</option>
										))}
									</select>
								</Stack>

								<Stack className="form-group">
									<Typography className="form-label">Beds *</Typography>
									<select
										className="form-select"
										value={insertProductData.productBeds || ''}
										onChange={({ target: { value } }) =>
											setInsertProductData({ ...insertProductData, productBeds: parseInt(value) })
										}
									>
										<option value="" disabled>
											Select beds
										</option>
										{[1, 2, 3, 4, 5, 6, 7, 8].map((bed: number) => (
											<option value={bed} key={bed}>
												{bed} {bed === 1 ? 'Bed' : 'Beds'}
											</option>
										))}
									</select>
								</Stack>
							</Stack>

							{/* Description */}
							<Stack className="form-group full-width">
								<Typography className="form-label">Product Description *</Typography>
								<textarea
									className="form-textarea"
									placeholder="Describe your product in detail..."
									rows={6}
									value={insertProductData.productDesc}
									onChange={({ target: { value } }) =>
										setInsertProductData({ ...insertProductData, productDesc: value })
									}
								/>
							</Stack>
						</Stack>
					</Stack>

					{/* Images Upload Card */}
					<Stack className="form-card">
						<Stack className="card-header">
							<ImageIcon size={20} />
							<Typography className="card-title">Product Images</Typography>
						</Stack>

						<Stack className="form-content">
							<Stack className="upload-area">
								<Stack
									className="upload-zone"
									onClick={() => inputRef.current?.click()}
								>
									<Upload size={48} className="upload-icon" />
									<Typography className="upload-title">Drop images here or click to browse</Typography>
									<Typography className="upload-subtitle">
										JPEG, JPG or PNG • Max 5 images • Min 2048x768px
									</Typography>
									<Button className="upload-button">
										<Upload size={18} />
										<span>Select Images</span>
									</Button>
									<input
										ref={inputRef}
										type="file"
										hidden
										onChange={uploadImages}
										multiple
										accept="image/jpg, image/jpeg, image/png"
									/>
								</Stack>

								{/* Image Gallery */}
								{insertProductData.productImages.length >= 0 && (
									<Stack className="images-gallery">
										{insertProductData.productImages.map((image: string, index: number) => (
											<Stack className="image-preview" key={index}>
												<img src={`${REACT_APP_API_URL}/${image}`} alt={`Product ${index + 1}`} />
												<Button
													className="remove-image"
													onClick={() => removeImage(index)}
												>
													<X size={16} />
												</Button>
												<Stack className="image-badge">
													{index === 0 && <span className="badge-primary">Primary</span>}
												</Stack>
											</Stack>
										))}
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>

					{/* Action Buttons */}
					<Stack className="form-actions">
						<Button className="cancel-button" onClick={() => router.back()}>
							Cancel
						</Button>
						{router.query.productId ? (
							<Button
								className="submit-button"
								disabled={doDisabledCheck()}
								onClick={updateProductHandler}
							>
								<span>Update Listing</span>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
										fill="currentColor"
									/>
								</svg>
							</Button>
						) : (
							<Button
								className="submit-button"
								disabled={doDisabledCheck()}
								onClick={insertProductHandler}
							>
								<span>Create Listing</span>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
										fill="currentColor"
									/>
								</svg>
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

AddProduct.defaultProps = {
	initialValues: {
		productTitle: '',
		productPrice: 0,
		productType: '',
		productLocation: '',
		productAddress: '',
		productBarter: false,
		productRent: false,
		productRooms: 0,
		productBeds: 0,
		productSquare: 0,
		productDesc: '',
		productImages: [],
	},
};

export default AddProduct;