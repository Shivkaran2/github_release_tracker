import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './utils/auth';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Repository: {
        keyFields: ['id'],
        fields: {
          releases: {
            merge: false,
          },
        },
      },
      Release: {
        keyFields: ['id'],
      },
      Query: {
        fields: {
          repositories: {
            merge: false,
          },
        },
      },
    },
  }),
});




