import React from 'react';
import { Stack, Box, Chip } from '@mui/material';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const PopularProducts = () => {
	const device = useDeviceDetect();

	// Mock Data - Keyinchalik API dan keladi
	const featuredProducts = [
		{
			id: 1,
			title: 'MacBook Pro M3 2023',
			price: '₩1,500,000',
			condition: 'Like New',
			seller: 'John Kim',
			image: '/img/product/macbookpro.jpeg',
			category: 'Electronics',
		},
		{
			id: 2,
			title: 'Calculus Textbook Bundle',
			price: '₩45,000',
			condition: 'Good',
			seller: 'Sarah Lee',
			image: '/img/product/textbook.webp',
			category: 'Books',
		},
		{
			id: 3,
			title: 'Gaming Keyboard & Mouse',
			price: '₩80,000',
			condition: 'Excellent',
			seller: 'Mike Park',
			image: '/img/product/gamingkey.webp',
			category: 'Electronics',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className="marketplace-section">
				<div>Marketplace Mobile</div>
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
						<Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
							<Box className="product-item">
								<Box className="product-image">
									<img src={product.image} alt={product.title} />
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