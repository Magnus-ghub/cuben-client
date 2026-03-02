import type { AppProps } from 'next/app';
import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/apollo/client';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '../libs/components/common/ThemeContext';
import { light } from '../scss/MaterialTheme';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';
import SocketManager from '../libs/components/Socketmeneger';

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider>
				<MuiThemeProvider theme={createTheme(light)}>
					<CssBaseline />
					<SocketManager />
					<Component {...pageProps} />
				</MuiThemeProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);