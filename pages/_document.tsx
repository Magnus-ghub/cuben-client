import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/univo-logo.svg" />

				{/* SEO */}
				<meta name="keyword" content={'univo, campus market, univo.kr, student market, buy sell items, second-hand'} />

				<meta
					name="description"
					content={
						'Univo is a campus-centered community platform designed for university students. It enables users to share posts, exchange knowledge, ask questions, and engage with their academic community. In addition, the platform includes a built-in second-hand marketplace for secure peer-to-peer trading of books, electronics, and more. Univo focuses on building a trusted student ecosystem driven by communication and collaboration. | ' +
						'Univo는 대학생을 위한 캠퍼스 커뮤니티 플랫폼입니다. 학생들은 게시글을 작성하고 지식을 공유하며 질문하고 소통할 수 있습니다. 또한 중고 거래 기능이 포함되어 있어 교재, 전자제품 등 다양한 물품을 안전하게 거래할 수 있습니다. Univo는 신뢰와 소통을 기반으로 한 학생 커뮤니티 생태계를 지향합니다.' +
						'Univo — talabalar uchun yaratilgan kampus community platformasi. Talabalar bu yerda postlar joylashtirishi, bilim va tajriba almashishi, savollar berishi va o‘zaro muloqot qilishi mumkin. Platforma ichida second-hand marketplace ham mavjud bo‘lib, foydalanuvchilar kitoblar, elektronika va boshqa buyumlarni xavfsiz tarzda savdo qilishi mumkin. Univo — bilim, hamjamiyat va ishonch asosidagi ekotizim. | ' 
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
