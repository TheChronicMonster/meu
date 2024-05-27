import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import CourseManagement from './components/CourseManagement';
import Auth from './components/Auth';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const httpLink = createHttpLink({
    uri: 'http://localhost:5001/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        {token ? (
          <>
            <CourseManagement />
            <button onClick={() => {
              setToken(null);
              localStorage.removeItem('token');
            }}>Logout</button>
          </>
        ) : (
          <Auth setToken={setToken} />
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;
