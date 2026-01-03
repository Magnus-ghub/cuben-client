import React, { useEffect, useState } from 'react';
import { Container, Stack, Box, Typography, IconButton, Avatar, Chip, Button, CircularProgress } from '@mui/material';
import SwiperCore, { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../libs/apollo/store';
import { Product } from '../../libs/types/product/product';
import { LIKE_TARGET_PRODUCT } from '../../libs/apollo/user/mutation';
import { GET_PRODUCT, GET_PRODUCTS } from '../../libs/apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import moment from 'moment';
import Link from 'next/link';
import ProductBigCard from '../../libs/components/common/ProductBigCard';
import 'swiper/css';
import 'swiper/css/pagination';

SwiperCore.use([Autoplay, Navigation, SwiperPagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MarketplaceDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [productId, setProductId] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProducts, setDestinationProducts] = useState<Product[]>([]);
	const [isSaved, setIsSaved] = useState(false); // Hard coding - save functionality
	const [contactName, setContactName] = useState<string>('');
	const [contactMessage, setContactMessage] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: productId },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProduct) setProduct(data?.getProduct);
			if (data?.getProduct) setSlideImage(data?.getProduct?.productImages[0]);
		},
	});

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: product?.productLocation ? [product?.productLocation] : [],
				},
			},
		},
		skip: !productId && !product,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProducts?.list) setDestinationProducts(data?.getProducts?.list);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setProductId(router.query.id as string);
		}
	}, [router]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});

			await getProductRefetch({ input: id });

			await getProductsRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [product?.productLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sendMessageHandler = () => {
		// Hard coding - message sending functionality
		if (!user._id) {
			sweetMixinErrorAlert('Please login to send message').then();
			return;
		}
		if (!contactName || !contactMessage) {
			sweetMixinErrorAlert('Please fill in all fields').then();
			return;
		}
		console.log('Sending message:', { 
			to: product?.memberData?._id,
			from: user._id,
			name: contactName, 
			message: contactMessage 
		});
		sweetTopSmallSuccessAlert('Message sent successfully!', 800);
		setContactName('');
		setContactMessage('');
	};

	// Hard coded helper functions
	const getCategoryFromType = (type: string): string => {
		const categoryMap: { [key: string]: string } = {
			ELECTRONICS: 'Electronics',
			FURNITURE: 'Furniture',
			BOOKS: 'Books',
			CLOTHING: 'Clothing',
			SPORTS: 'Sports',
			OTHER: 'Other',
		};
		return categoryMap[type] || type;
	};

	// const getBrandFromProduct = (product: Product | null): string => {
	// 	// Hard coded - backend da brand yo'q
	// 	if (!product) return 'N/A';
	// 	if (product.productType === 'ELECTRONICS') return 'Apple';
	// 	if (product.productType === 'FURNITURE') return 'IKEA';
	// 	if (product.productType === 'BOOKS') return 'Penguin Books';
	// 	if (product.productType === 'CLOTHING') return 'H&M';
	// 	return 'Generic Brand';
	// };

	if (getProductLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <Container>MARKETPLACE DETAIL MOBILE</Container>;
	} else {
		return (
			<div id="marketplace-detail-page">
				<Container className="detail-container">
					{/* Breadcrumb */}
					<Stack className="breadcrumb">
						<Link href="/product">
							<Typography className="crumb">Marketplace</Typography>
						</Link>
						<Typography className="separator">/</Typography>
						<Typography className="crumb">{getCategoryFromType(product?.productType || '')}</Typography>
						<Typography className="separator">/</Typography>
						<Typography className="crumb active">{product?.productTitle}</Typography>
					</Stack>

					<Stack className="detail-layout">
						{/* LEFT COLUMN */}
						<Stack className="left-column">
							{/* Image Gallery */}
							<Stack className="image-gallery">
								<Box className="main-image">
									<img
										src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/product/default-product.jpg'}
										alt={product?.productTitle}
									/>
									<Stack className="image-badges">
										<Chip label={product?.productCondition?.toUpperCase()} className="condition-chip" />
										{product?.soldAt && <Chip label="SOLD" className="sold-chip" />}
									</Stack>
								</Box>
								<Stack className="thumbnail-list">
									{product?.productImages?.map((subImg: string, idx: number) => {
										const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
										return (
											<Box
												key={idx}
												className={`thumbnail ${slideImage === subImg ? 'active' : ''}`}
												onClick={() => changeImageHandler(subImg)}
											>
												<img src={imagePath} alt={`Thumbnail ${idx + 1}`} />
											</Box>
										);
									})}
								</Stack>
							</Stack>

							{/* Description */}
							<Stack className="description-section">
								<Typography className="section-title">Description</Typography>
								<Typography className="description-text">
									{product?.productDesc || 'No description available for this product.'}
								</Typography>
							</Stack>

							{/* Product Details */}
							<Stack className="details-section">
								<Typography className="section-title">Product Details</Typography>
								<Stack className="details-grid">
									<Stack className="detail-row">
										<Typography className="detail-label">Category</Typography>
										<Typography className="detail-value">{getCategoryFromType(product?.productType || '')}</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Condition</Typography>
										<Typography className="detail-value">{product?.productCondition}</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Brand</Typography>
										<Typography className="detail-value"></Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Status</Typography>
										<Typography className={`detail-value ${product?.productStatus?.toLowerCase()}`}>
											{product?.soldAt ? 'SOLD' : product?.productStatus}
										</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Views</Typography>
										<Typography className="detail-value">{product?.productViews}</Typography>
									</Stack>
									<Stack className="detail-row">
										<Typography className="detail-label">Posted</Typography>
										<Typography className="detail-value">{moment(product?.createdAt).fromNow()}</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Meetup Location */}
							<Stack className="location-section">
								<Typography className="section-title">Meetup Location</Typography>
								<Stack className="location-card">
									<LocationOnIcon className="location-icon" />
									<Stack className="location-info">
										<Typography className="location-name">{product?.productLocation}</Typography>
										<Typography className="location-detail">
											{product?.productAddress || 'Contact seller for exact meetup location'}
										</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Report Section - Hard coded */}
							{product?.productPrice && product.productPrice > 0 && (
								<Stack className="report-section">
									<Typography className="section-title">Safety Notice</Typography>
									<Stack className="report-card">
										<Typography className="report-text">
											This item has {}. Please exercise caution.
										</Typography>
									</Stack>
								</Stack>
							)}
						</Stack>

						{/* RIGHT COLUMN (SIDEBAR) */}
						<Stack className="right-column">
							{/* Product Header */}
							<Stack className="product-header">
								<Typography className="product-title">{product?.productTitle}</Typography>
								<Stack className="product-meta">
									<Chip label={getCategoryFromType(product?.productType || '').toUpperCase()} className="category-chip" />
									<Typography className="post-date">Posted {moment(product?.createdAt).fromNow()}</Typography>
								</Stack>
							</Stack>

							{/* Price & Actions */}
							<Stack className="price-section">
								<Stack className="price-row">
									<Stack className="action-icons">
										<IconButton className="action-icon" onClick={() => likeProductHandler(user, product?._id!)}>
											{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
												<FavoriteIcon className="favorited" />
											) : (
												<FavoriteBorderIcon />
											)}
										</IconButton>
										<IconButton className="action-icon" onClick={() => setIsSaved(!isSaved)}>
											{isSaved ? <BookmarkIcon style={{ color: '#667eea' }} /> : <BookmarkBorderIcon />}
										</IconButton>
									</Stack>
								</Stack>
								<Stack className="stats-row">
									<Stack className="stat">
										<RemoveRedEyeIcon />
										<Typography>{product?.productViews} views</Typography>
									</Stack>
									<Stack className="stat">
										<FavoriteIcon className="favorited" />
										<Typography>{product?.productLikes} likes</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Seller Card */}
							<Stack className="seller-card">
								<Typography className="card-title">Seller Information</Typography>
								<Stack className="seller-profile">
									<Avatar
										src={
											product?.memberData?.memberImage
												? `${REACT_APP_API_URL}/${product?.memberData?.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt={product?.memberData?.memberNick}
										className="seller-avatar"
									/>
									<Stack className="seller-info">
										<Stack className="seller-name-row">
											<Link href={`/member?memberId=${product?.memberData?._id}`}>
												<Typography className="seller-name">{product?.memberData?.memberNick}</Typography>
											</Link>
											{product?.memberData?.memberRank && product.memberData.memberRank > 5 && (
												<VerifiedIcon className="verified-icon" />
											)}
										</Stack>
										<Typography className="seller-username">@{product?.memberData?.memberNick?.toLowerCase()}</Typography>
										<Stack className="seller-stats">
											<Typography className="seller-listings">
												{product?.memberData?.memberProducts || 0} active listings
											</Typography>
											<Typography className="seller-points">
												{product?.memberData?.memberPoints || 0} points
											</Typography>
										</Stack>
									</Stack>
								</Stack>
							</Stack>

							{/* Contact Form */}
							<Stack className="contact-card">
								<Typography className="card-title">Contact Seller</Typography>
								<Stack className="form-group">
									<Typography className="input-label">Your Name</Typography>
									<input
										type="text"
										placeholder="Enter your name"
										className="form-input"
										value={contactName}
										onChange={(e) => setContactName(e.target.value)}
									/>
								</Stack>
								<Stack className="form-group">
									<Typography className="input-label">Message</Typography>
									<textarea
										placeholder={`Hi, I'm interested in ${product?.productTitle}...`}
										className="form-textarea"
										rows={4}
										value={contactMessage}
										onChange={(e) => setContactMessage(e.target.value)}
									/>
								</Stack>
								<Button
									className="send-button"
									onClick={sendMessageHandler}
									disabled={!user._id || !!product?.soldAt}
									fullWidth
								>
									<Typography component="p">
										{product?.soldAt ? 'Item Sold' : 'Send Message'}
									</Typography>
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* Similar Products */}
					{destinationProducts.length !== 0 && (
						<Stack className="similar-products-config">
							<Stack className="title-pagination-box">
								<Stack className="title-box">
									<Typography className="main-title">Similar Products</Typography>
									<Typography className="sub-title">
										Other items from {product?.productLocation}
									</Typography>
								</Stack>
								<Stack className="pagination-box">
									<WestIcon className="swiper-similar-prev" />
									<div className="swiper-similar-pagination"></div>
									<EastIcon className="swiper-similar-next" />
								</Stack>
							</Stack>
							<Stack className="cards-box">
								<Swiper
									className="similar-products-swiper"
									slidesPerView={'auto'}
									spaceBetween={35}
									modules={[Autoplay, Navigation, SwiperPagination]}
									navigation={{
										nextEl: '.swiper-similar-next',
										prevEl: '.swiper-similar-prev',
									}}
									pagination={{
										el: '.swiper-similar-pagination',
									}}
								>
									{destinationProducts.map((product: Product) => {
										return (
											<SwiperSlide className="similar-products-slide" key={product?._id}>
												<ProductBigCard product={product} likeProductHandler={likeProductHandler} key={product?._id} />
											</SwiperSlide>
										);
									})}
								</Swiper>
							</Stack>
						</Stack>
					)}
				</Container>
			</div>
		);
	}
};

MarketplaceDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		search: {
			productId: '',
		},
	},
};

export default withLayoutMain(MarketplaceDetail);