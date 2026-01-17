import React from 'react';
import { Stack, Box, Chip, Skeleton, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { Product } from '../../types/product/product';

const PopularProducts = () => {
	const device = useDeviceDetect();

	const { loading, data, error } = useQuery(GET_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit: 2, 
				sort: 'productLikes',
				direction: 'DESC', 
				search: {}, 
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const featuredProducts = data?.getProducts?.list?.map((product: Product) => ({
		id: product._id,
		title: product.productName,
		price: `₩${product.productPrice?.toLocaleString() || 'Negotiable'}`,
		condition: product.productCondition || 'Good',
		seller: product.memberData?.memberNick || 'Unknown Seller',
		image: product.productImages && product.productImages.length > 0
			? `${process.env.REACT_APP_API_URL}/${product.productImages[0]}`
			: '/img/default-product.png',
		category: product.productType || 'Electronics',
	})) || [];

	if (error) {
		console.error('Error fetching popular products:', error);
		return (
			<Stack className="marketplace-section">
				<Box className="marketplace-card error-state">
					<p>Unable to load products. Please try again later.</p>
				</Box>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<Stack className="marketplace-section">
				<div>Marketplace Mobile</div>
			</Stack>
		);
	}

	if (loading) {
		return (
			<Stack className="marketplace-section">
				<Box className="marketplace-card">
					<Box className="card-header">
						<ShoppingBag size={20} className="header-icon" />
						<h3>Marketplace Picks</h3>
						<Link href="/product" className="view-all-link">
							View All
						</Link>
					</Box>
					<Stack className="products-grid">
						{Array.from({ length: 2 }).map((_, i) => (  
							<Skeleton key={i} variant="rectangular" height={250} className="product-skeleton" />
						))}
					</Stack>
				</Box>
			</Stack>
		);
	}

	if (featuredProducts.length === 0) {
		return (
			<Stack className="marketplace-section">
				<Box className="marketplace-card">
					<Box className="card-header">
						<ShoppingBag size={20} className="header-icon" />
						<h3>Marketplace Picks</h3>
						<Link href="/product" className="view-all-link">
							View All
						</Link>
					</Box>
					<Box className="empty-state">
						<p>No popular products available at the moment.</p>
						<Link href="/product">
							<Button variant="outlined">Browse All Products</Button>
						</Link>
					</Box>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className="marketplace-section">
			<Box className="marketplace-card">
				<Box className="card-header">
					<ShoppingBag size={20} className="header-icon" />
					<h3>Marketplace Picks</h3>
					<Link href="/product" className="view-all-link">
						View All
					</Link>
				</Box>
				<Stack className="products-grid">
					{featuredProducts.map((product) => (
						<Link key={product.id} href={`/product?id=${product.id}`} style={{ textDecoration: 'none' }}>  {/* O'zgarish: Query param ishlatildi (?id=...) */}
							<Box className="product-item">
								<Box className="product-image">
									<img 
										src={product.image} 
										alt={product.title} 
										onError={(e) => {  
											e.currentTarget.src = '/img/default-product.png';
										}}
									/>
									<Chip label={product.condition} size="small" className="product-condition" />
								</Box>
								<Box className="product-info">
									<h4>{product.title}</h4>
									<p className="product-price">{product.price}</p>
									<Box className="product-meta">
										<span className="seller-name">{product.seller}</span>
										<Chip label={product.category} size="small" />
									</Box>
								</Box>
							</Box>
						</Link>
					))}
				</Stack>
			</Box>
		</Stack>
	);
};

export default PopularProducts;