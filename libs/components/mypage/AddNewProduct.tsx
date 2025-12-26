import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL, propertySquare } from '../../config';
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
	const [insertPropertyData, setInsertPropertyData] = useState<ProductInput>(initialValues);
	const [propertyType, setPropertyType] = useState<ProductType[]>(Object.values(ProductType));
	const [propertyLocation, setPropertyLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	let getPropertyData: any, getPropertyLoading: any;

	/** LIFECYCLES **/
	useEffect(() => {
		setInsertPropertyData({
			...insertPropertyData,
			productTitle: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyTitle : '',
			productPrice: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyPrice : 0,
			productType: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyType : '',
			productLocation: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyLocation : '',
			productAddress: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyAddress : '',
			productBarter: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyBarter : false,
			productRent: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyRent : false,
			productRooms: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyRooms : 0,
			productBeds: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyBeds : 0,
			productSquare: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertySquare : 0,
			productDesc: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyDesc : '',
			productImages: getPropertyData?.getProperty ? getPropertyData?.getProperty?.propertyImages : [],
		});
	}, [getPropertyLoading, getPropertyData]);

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
						target: 'property',
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
			setInsertPropertyData({ ...insertPropertyData, productImages: responseImages });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}

	const removeImage = (indexToRemove: number) => {
		const updatedImages = insertPropertyData.productImages.filter((_, index) => index !== indexToRemove);
		setInsertPropertyData({ ...insertPropertyData, productImages: updatedImages });
	};

	const doDisabledCheck = () => {
		if (
			insertPropertyData.productTitle === '' ||
			insertPropertyData.productPrice === 0 ||
			!insertPropertyData.productType ||
			!insertPropertyData.productLocation ||
			insertPropertyData.productAddress === '' ||
			insertPropertyData.productRooms === 0 ||
			insertPropertyData.productBeds === 0 ||
			insertPropertyData.productSquare === 0 ||
			insertPropertyData.productDesc === '' ||
			insertPropertyData.productImages.length === 0
		) {
			return true;
		}
	};

	const insertPropertyHandler = useCallback(async () => {}, [insertPropertyData]);

	const updatePropertyHandler = useCallback(async () => {}, [insertPropertyData]);

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>ADD NEW PROPERTY MOBILE PAGE</div>;
	} else {
		return (
			<div id="add-property-page">
				{/* Header Section */}
				<Stack className="page-header-section">
					<Stack className="header-content">
						<Typography className="page-title">
							{router.query.propertyId ? 'Edit Listing' : 'Create New Listing'}
						</Typography>
						<Typography className="page-subtitle">
							Fill in the details below to {router.query.propertyId ? 'update' : 'list'} your property
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
								<Typography className="form-label">Property Title *</Typography>
								<input
									type="text"
									className="form-input"
									placeholder="Enter property title"
									value={insertPropertyData.productTitle}
									onChange={({ target: { value } }) =>
										setInsertPropertyData({ ...insertPropertyData, productTitle: value })
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
											value={insertPropertyData.productPrice}
											onChange={({ target: { value } }) =>
												setInsertPropertyData({ ...insertPropertyData, productPrice: parseInt(value) || 0 })
											}
										/>
									</div>
								</Stack>

								<Stack className="form-group">
									<Typography className="form-label">Property Type *</Typography>
									<select
										className="form-select"
										value={insertPropertyData.productType || ''}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productType: value as ProductType })
										}
									>
										<option value="" disabled>
											Select property type
										</option>
										{propertyType.map((type: any) => (
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
											value={insertPropertyData.productLocation || ''}
											onChange={({ target: { value } }) =>
												setInsertPropertyData({ ...insertPropertyData, productLocation: value as ProductLocation })
											}
										>
											<option value="" disabled>
												Select location
											</option>
											{propertyLocation.map((location: any) => (
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
										value={insertPropertyData.productAddress}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productAddress: value })
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
										value={insertPropertyData.productBarter ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productBarter: value === 'yes' })
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
										value={insertPropertyData.productRent ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productRent: value === 'yes' })
										}
									>
										<option value="no">No</option>
										<option value="yes">Yes</option>
									</select>
								</Stack>
							</Stack>
						</Stack>
					</Stack>

					{/* Property Details Card */}
					<Stack className="form-card">
						<Stack className="card-header">
							<Maximize size={20} />
							<Typography className="card-title">Property Details</Typography>
						</Stack>

						<Stack className="form-content">
							<Stack className="form-row three-columns">
								<Stack className="form-group">
									<Typography className="form-label">Rooms *</Typography>
									<select
										className="form-select"
										value={insertPropertyData.productRooms || ''}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productRooms: parseInt(value) })
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
										value={insertPropertyData.productBeds || ''}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productBeds: parseInt(value) })
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

								<Stack className="form-group">
									<Typography className="form-label">Square (m²) *</Typography>
									<select
										className="form-select"
										value={insertPropertyData.productSquare || ''}
										onChange={({ target: { value } }) =>
											setInsertPropertyData({ ...insertPropertyData, productSquare: parseInt(value) })
										}
									>
										<option value="" disabled>
											Select size
										</option>
										{propertySquare.map((square: number) => {
											if (square !== 0) {
												return (
													<option value={square} key={square}>
														{square} m²
													</option>
												);
											}
										})}
									</select>
								</Stack>
							</Stack>

							{/* Description */}
							<Stack className="form-group full-width">
								<Typography className="form-label">Property Description *</Typography>
								<textarea
									className="form-textarea"
									placeholder="Describe your property in detail..."
									rows={6}
									value={insertPropertyData.productDesc}
									onChange={({ target: { value } }) =>
										setInsertPropertyData({ ...insertPropertyData, productDesc: value })
									}
								/>
							</Stack>
						</Stack>
					</Stack>

					{/* Images Upload Card */}
					<Stack className="form-card">
						<Stack className="card-header">
							<ImageIcon size={20} />
							<Typography className="card-title">Property Images</Typography>
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
								{insertPropertyData.productImages.length >= 0 && (
									<Stack className="images-gallery">
										{insertPropertyData.productImages.map((image: string, index: number) => (
											<Stack className="image-preview" key={index}>
												<img src={`${REACT_APP_API_URL}/${image}`} alt={`Property ${index + 1}`} />
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
						{router.query.propertyId ? (
							<Button
								className="submit-button"
								disabled={doDisabledCheck()}
								onClick={updatePropertyHandler}
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
								onClick={insertPropertyHandler}
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