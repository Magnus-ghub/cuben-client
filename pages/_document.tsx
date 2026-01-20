import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			@types/react@18.2.0
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'cuben, campus market, cuben.uz, student market, buy sell items, second-hand'} />

				<meta
					name="description"
					content={
						// Uzbekcha
						'Cuben — talabalarga mo‘ljallangan second-hand marketplace. Universitet ichida kitoblar, elektronika, kiyim-kechak va boshqa buyumlarni oson sotish va xarid qilish platformasi. | ' +
						// English
						'Cuben is a student-focused second-hand marketplace for buying and selling used items such as books, electronics, clothing, and more within the campus. Convenient, fast, and secure. | ' +
						// Koreyscha
						'Cuben — 대학생을 위한 중고 거래 플랫폼입니다. 캠퍼스 내에서 책, 전자제품, 의류 등 다양한 물품을 쉽고 안전하게 사고 팔 수 있습니다.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
