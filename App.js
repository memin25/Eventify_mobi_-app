import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import useAuthStore from './src/store/useAuthStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika
      cacheTime: 1000 * 60 * 10, // 10 dakika
      retry: 2,
    },
  },
});

export default function App() {
  const { initAuthListener, checkAuth } = useAuthStore();

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
        initAuthListener();
      } catch (error) {
        console.error('App auth init error:', error);
      }
    };
    
    initAuth();
  }, [checkAuth, initAuthListener]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
