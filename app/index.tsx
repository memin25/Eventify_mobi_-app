import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from '../src/navigation/RootNavigator';
import useAuthStore from '../src/store/useAuthStore';

// React Query client oluştur
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika
      gcTime: 1000 * 60 * 10, // 10 dakika
      retry: 2,
    },
  },
});

export default function Index() {
  const { initAuthListener, checkAuth } = useAuthStore();

  React.useEffect(() => {
    // Auth durumunu kontrol et ve listener'ı başlat
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
      <RootNavigator />
    </QueryClientProvider>
  );
}
