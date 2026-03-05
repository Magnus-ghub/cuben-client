import type { AppProps } from 'next/app';
import React from 'react';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/apollo/client';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '../libs/components/common/ThemeContext';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
