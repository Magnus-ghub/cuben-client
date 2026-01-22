import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
	Box,
	Stack,
	TextField,
	Button,
	MenuItem,
	CircularProgress,
	InputAdornment,
	IconButton,
	Tabs,
	Tab,
} from '@mui/material';
import {
	X,
	Upload,
	Trash2,
	DollarSign,
	MapPin,
	Package,
	FileText,
	ArrowLeft,
	Save,
	Image as ImageIcon,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

// Types
import { ProductUpdate } from '../../types/product/product.update';
import { PostUpdate } from '../../types/post/post.update';
import { ArticleUpdate } from '../../types/article/article.update';

// Enums
import { ProductType, ProductCondition, ProductStatus } from '../../enums/product.enum';
import { ArticleCategory, ArticleStatus } from '../../enums/article.enum';
import { PostStatus } from '../../enums/post.enum';

// Apollo
import { GET_PRODUCT, GET_POST, GET_ARTICLE } from '../../apollo/user/query';
import { UPDATE_PRODUCT, UPDATE_POST, UPDATE_ARTICLE } from '../../apollo/user/mutation';
import useDeviceDetect from '../../hooks/useDeviceDetect';

type ItemType = 'product' | 'post' | 'article';

const UpdateItems: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { type, id, productId, postId, articleId } = router.query;

	const [loading, setLoading] = useState(false);
	const [itemType, setItemType] = useState<ItemType>('product');
	const [itemId, setItemId] = useState<string>('');

	// Image states
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);

	// Form states
	const [productForm, setProductForm] = useState<ProductUpdate>({
		_id: '',
		productType: ProductType.TECH,
		productStatus: ProductStatus.ACTIVE,
		productCondition: ProductCondition.NEW,
		productAddress: '',
		productName: '',
		productPrice: 0,
		productDesc: '',
	});

	const [postForm, setPostForm] = useState<PostUpdate>({
		_id: '',
		postStatus: PostStatus.ACTIVE,
		postTitle: '',
		postContent: '',
	});

	const [articleForm, setArticleForm] = useState<ArticleUpdate>({
		_id: '',
		articleStatus: ArticleStatus.ACTIVE,
		articleCategory: ArticleCategory.CAREER,
		articleTitle: '',
		articleContent: '',
	});

	/** MUTATIONS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);
	const [updatePost] = useMutation(UPDATE_POST);
	const [updateArticle] = useMutation(UPDATE_ARTICLE);

	/** QUERIES **/
	const { data: productData, loading: productLoading } = useQuery(GET_PRODUCT, {
		variables: { input: itemId },
		skip: !itemId || itemType !== 'product',
		onCompleted: (data) => {
			const product = data?.getProduct;
			if (product) {
				setProductForm({
					_id: product._id,
					productType: product.productType,
					productStatus: product.productStatus,
					productCondition: product.productCondition,
					productAddress: product.productAddress || '',
					productName: product.productName,
					productPrice: product.productPrice,
					productDesc: product.productDesc || '',
				});
				setExistingImages(product.productImages || []);
			}
		},
	});

	const { data: postData, loading: postLoading } = useQuery(GET_POST, {
		variables: { input: itemId },
		skip: !itemId || itemType !== 'post',
		onCompleted: (data) => {
			const post = data?.getPost;
			if (post) {
				setPostForm({
					_id: post._id,
					postStatus: post.postStatus,
					postTitle: post.postTitle,
					postContent: post.postContent,
				});
				setExistingImages(post.postImages || []);
			}
		},
	});

	const { data: articleData, loading: articleLoading } = useQuery(GET_ARTICLE, {
		variables: { input: itemId },
		skip: !itemId || itemType !== 'article',
		onCompleted: (data) => {
			const article = data?.getArticle;
			if (article) {
				setArticleForm({
					_id: article._id,
					articleStatus: article.articleStatus,
					articleCategory: article.articleCategory,
					articleTitle: article.articleTitle,
					articleContent: article.articleContent,
				});
				if (article.articleImage) {
					setExistingImages([article.articleImage]);
				}
			}
		},
	});

	/** LIFECYCLE **/
	useEffect(() => {
		// Determine type and id from query params
		if (type && id) {
			setItemType(type as ItemType);
			setItemId(id as string);
		} else if (productId) {
			setItemType('product');
			setItemId(productId as string);
		} else if (postId) {
			setItemType('post');
			setItemId(postId as string);
		} else if (articleId) {
			setItemType('article');
			setItemId(articleId as string);
		}
	}, [type, id, productId, postId, articleId]);

	/** IMAGE HANDLERS **/
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setNewImages([...newImages, ...files]);

		// Create preview URLs
		const previews = files.map((file) => URL.createObjectURL(file));
		setPreviewImages([...previewImages, ...previews]);
	};

	const removeExistingImage = (index: number) => {
		setExistingImages(existingImages.filter((_, i) => i !== index));
	};

	const removeNewImage = (index: number) => {
		// Revoke URL to free memory
		URL.revokeObjectURL(previewImages[index]);
		setNewImages(newImages.filter((_, i) => i !== index));
		setPreviewImages(previewImages.filter((_, i) => i !== index));
	};

	/** FORM HANDLERS **/
	const handleProductChange = (field: keyof ProductUpdate, value: any) => {
		setProductForm({ ...productForm, [field]: value });
	};

	const handlePostChange = (field: keyof PostUpdate, value: any) => {
		setPostForm({ ...postForm, [field]: value });
	};

	const handleArticleChange = (field: keyof ArticleUpdate, value: any) => {
		setArticleForm({ ...articleForm, [field]: value });
	};

	/** SUBMIT HANDLER **/
	const handleSubmit = async () => {
		try {
			setLoading(true);

			if (itemType === 'product') {
				const updateData: ProductUpdate = {
					...productForm,
					productImages: existingImages,
				};

				await updateProduct({
					variables: { input: updateData },
				});

				await sweetTopSmallSuccessAlert('Product updated successfully!', 800);
			} else if (itemType === 'post') {
				const updateData: PostUpdate = {
					...postForm,
					postImages: existingImages,
				};

				await updatePost({
					variables: { input: updateData },
				});

				await sweetTopSmallSuccessAlert('Post updated successfully!', 800);
			} else if (itemType === 'article') {
				const updateData: ArticleUpdate = {
					...articleForm,
					articleImage: existingImages[0] || '',
				};

				await updateArticle({
					variables: { input: updateData },
				});

				await sweetTopSmallSuccessAlert('Article updated successfully!', 800);
			}

			// Navigate back
			setTimeout(() => {
				router.push('/mypage?category=myProducts');
			}, 1000);
		} catch (error: any) {
			console.error('Update error:', error);
			sweetMixinErrorAlert(error.message || 'Failed to update item');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	/** LOADING STATE **/
	if (!user?._id || productLoading || postLoading || articleLoading) {
		return (
			<Box className="update-items-container">
				<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
					<CircularProgress size={48} />
					<p style={{ marginTop: '16px', color: '#6b7280' }}>Loading...</p>
				</Stack>
			</Box>
		);
	}

	if (device === 'mobile') {
		return <div>UPDATE ITEMS MOBILE</div>;
	}

	/** RENDER ICON **/
	const getIcon = () => {
		switch (itemType) {
			case 'product':
				return <Package size={24} />;
			case 'post':
				return <FileText size={24} />;
			case 'article':
				return <FileText size={24} />;
			default:
				return <Package size={24} />;
		}
	};

	const getTitle = () => {
		switch (itemType) {
			case 'product':
				return 'Edit Product';
			case 'post':
				return 'Edit Post';
			case 'article':
				return 'Edit Article';
			default:
				return 'Edit Item';
		}
	};

	return (
		<Box className="update-items-container">
			{/* Header */}
			<Box className="update-header">
				<Stack direction="row" alignItems="center" gap={2}>
					<IconButton onClick={handleCancel} className="back-btn">
						<ArrowLeft size={20} />
					</IconButton>
					<Box className="header-icon">{getIcon()}</Box>
					<Box>
						<h2 className="page-title">{getTitle()}</h2>
						<p className="page-subtitle">Update your {itemType} information</p>
					</Box>
				</Stack>
			</Box>

			{/* Content */}
			<Box className="update-content">
				<Stack spacing={3}>
					{/* Images Section */}
					<Box className="form-section">
						<label className="section-label">
							<ImageIcon size={18} />
							<span>{itemType === 'article' ? 'Cover Image' : 'Images'}</span>
						</label>
						<Box className="images-grid">
							{existingImages.map((img, index) => (
								<Box key={`existing-${index}`} className="image-preview">
									<img src={`${REACT_APP_API_URL}/${img}`} alt={`Image ${index + 1}`} />
									<IconButton size="small" className="remove-image-btn" onClick={() => removeExistingImage(index)}>
										<Trash2 size={14} />
									</IconButton>
								</Box>
							))}
							{previewImages.map((preview, index) => (
								<Box key={`new-${index}`} className="image-preview">
									<img src={preview} alt={`New ${index + 1}`} />
									<IconButton size="small" className="remove-image-btn" onClick={() => removeNewImage(index)}>
										<Trash2 size={14} />
									</IconButton>
								</Box>
							))}
							{(itemType !== 'article' || existingImages.length === 0) && (
								<label className="upload-box">
									<input
										type="file"
										multiple={itemType !== 'article'}
										accept="image/*"
										onChange={handleImageUpload}
										style={{ display: 'none' }}
									/>
									<Upload size={24} />
									<span>Add Photo</span>
								</label>
							)}
						</Box>
					</Box>

					{/* Product Form */}
					{itemType === 'product' && (
						<>
							<Box className="form-section">
								<label className="section-label">Product Name</label>
								<TextField
									fullWidth
									placeholder="Enter product name"
									value={productForm.productName}
									onChange={(e) => handleProductChange('productName', e.target.value)}
									className="custom-input"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Package size={18} className="input-icon" />
											</InputAdornment>
										),
									}}
								/>
							</Box>

							<Stack direction="row" spacing={2}>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Type</label>
									<TextField
										select
										fullWidth
										value={productForm.productType}
										onChange={(e) => handleProductChange('productType', e.target.value)}
										className="custom-input"
									>
										{Object.values(ProductType).map((type) => (
											<MenuItem key={type} value={type}>
												{type}
											</MenuItem>
										))}
									</TextField>
								</Box>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Condition</label>
									<TextField
										select
										fullWidth
										value={productForm.productCondition}
										onChange={(e) => handleProductChange('productCondition', e.target.value)}
										className="custom-input"
									>
										{Object.values(ProductCondition).map((condition) => (
											<MenuItem key={condition} value={condition}>
												{condition}
											</MenuItem>
										))}
									</TextField>
								</Box>
							</Stack>

							<Stack direction="row" spacing={2}>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Price</label>
									<TextField
										fullWidth
										type="number"
										placeholder="0"
										value={productForm.productPrice}
										onChange={(e) => handleProductChange('productPrice', Number(e.target.value))}
										className="custom-input"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<DollarSign size={18} className="input-icon" />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Address</label>
									<TextField
										fullWidth
										placeholder="Enter location"
										value={productForm.productAddress}
										onChange={(e) => handleProductChange('productAddress', e.target.value)}
										className="custom-input"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<MapPin size={18} className="input-icon" />
												</InputAdornment>
											),
										}}
									/>
								</Box>
							</Stack>

							<Box className="form-section">
								<label className="section-label">Status</label>
								<TextField
									select
									fullWidth
									value={productForm.productStatus}
									onChange={(e) => handleProductChange('productStatus', e.target.value)}
									className="custom-input"
								>
									{Object.values(ProductStatus).map((status) => (
										<MenuItem key={status} value={status}>
											{status}
										</MenuItem>
									))}
								</TextField>
							</Box>

							<Box className="form-section">
								<label className="section-label">Description</label>
								<TextField
									fullWidth
									multiline
									minRows={4}
									maxRows={6}
									placeholder="Enter product description..."
									value={productForm.productDesc}
									onChange={(e) => handleProductChange('productDesc', e.target.value)}
									className="custom-input"
								/>
							</Box>
						</>
					)}

					{/* Post Form */}
					{itemType === 'post' && (
						<>
							<Box className="form-section">
								<label className="section-label">Post Title</label>
								<TextField
									fullWidth
									placeholder="Enter post title"
									value={postForm.postTitle}
									onChange={(e) => handlePostChange('postTitle', e.target.value)}
									className="custom-input"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FileText size={18} className="input-icon" />
											</InputAdornment>
										),
									}}
								/>
							</Box>

							<Box className="form-section">
								<label className="section-label">Status</label>
								<TextField
									select
									fullWidth
									value={postForm.postStatus}
									onChange={(e) => handlePostChange('postStatus', e.target.value)}
									className="custom-input"
								>
									{Object.values(PostStatus).map((status) => (
										<MenuItem key={status} value={status}>
											{status}
										</MenuItem>
									))}
								</TextField>
							</Box>

							<Box className="form-section">
								<label className="section-label">Content</label>
								<TextField
									fullWidth
									multiline
									minRows={2}
									maxRows={10}
									placeholder="Write your post content..."
									value={postForm.postContent}
									onChange={(e) => handlePostChange('postContent', e.target.value)}
									className="custom-input"
								/>
							</Box>
						</>
					)}

					{/* Article Form */}
					{itemType === 'article' && (
						<>
							<Box className="form-section">
								<label className="section-label">Article Title</label>
								<TextField
									fullWidth
									placeholder="Enter article title"
									value={articleForm.articleTitle}
									onChange={(e) => handleArticleChange('articleTitle', e.target.value)}
									className="custom-input"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<FileText size={18} className="input-icon" />
											</InputAdornment>
										),
									}}
								/>
							</Box>

							<Stack direction="row" spacing={2}>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Category</label>
									<TextField
										select
										fullWidth
										value={articleForm.articleCategory}
										onChange={(e) => handleArticleChange('articleCategory', e.target.value)}
										className="custom-input"
									>
										{Object.values(ArticleCategory).map((category) => (
											<MenuItem key={category} value={category}>
												{category}
											</MenuItem>
										))}
									</TextField>
								</Box>
								<Box className="form-section" sx={{ flex: 1 }}>
									<label className="section-label">Status</label>
									<TextField
										select
										fullWidth
										value={articleForm.articleStatus}
										onChange={(e) => handleArticleChange('articleStatus', e.target.value)}
										className="custom-input"
									>
										{Object.values(ArticleStatus).map((status) => (
											<MenuItem key={status} value={status}>
												{status}
											</MenuItem>
										))}
									</TextField>
								</Box>
							</Stack>

							<Box className="form-section">
								<label className="section-label">Content</label>
								<TextField
									fullWidth
									multiline
									rows={12}
									placeholder="Write your article content..."
									value={articleForm.articleContent}
									onChange={(e) => handleArticleChange('articleContent', e.target.value)}
									className="custom-input"
								/>
							</Box>
						</>
					)}
				</Stack>
			</Box>

			{/* Footer */}
			<Box className="update-footer">
				<Button variant="outlined" onClick={handleCancel} className="cancel-btn" disabled={loading}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					className="submit-btn"
					disabled={loading}
					startIcon={loading ? <CircularProgress size={16} /> : <Save size={18} />}
				>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</Box>
		</Box>
	);
};

export default UpdateItems;