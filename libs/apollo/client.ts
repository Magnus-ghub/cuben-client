import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  NormalizedCacheObject,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { getJwtToken } from '../auth';
import { sweetErrorAlert } from '../sweetAlert';

// Global client (server va client uchun alohida)
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createHttpLink() {
  return new HttpLink({
    uri: process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3007/graphql',
    credentials: 'include',
  });
}

function createAuthLink() {
  return setContext((_, { headers }) => {
    const token = getJwtToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
}

function createErrorLink() {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.log(`[GraphQL error]: ${message}`);
        if (!message.includes('input')) sweetErrorAlert(message);
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
}

function createIsomorphicApolloLink() {
  // Serverda faqat HTTP ishlatamiz
  if (typeof window === 'undefined') {
    return ApolloLink.from([
      createErrorLink(),
      createAuthLink(),
      createHttpLink(),
    ]);
  }

 
  return ApolloLink.from([
    createErrorLink(),
    createAuthLink(),
    createHttpLink(),
  ]);
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphicApolloLink(),
    cache: new InMemoryCache(),
    // devtools: {
    //   enabled: process.env.NODE_ENV !== 'production',
    // },
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // Serverda har safar yangi client
  if (typeof window === 'undefined') return _apolloClient;

  // Clientda singleton
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}