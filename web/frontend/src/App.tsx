import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ToastProvider } from './components/providers/ToastProvider';
import { ConfigurationBuilder } from './features/configurations/ConfigurationBuilder';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/configurations" replace />} />
              <Route path="/configurations" element={<ConfigurationBuilder />} />
              {/* Add more routes as we develop other features */}
              <Route path="/documents" element={<div>Documents Page (Coming Soon)</div>} />
              <Route path="/tasks" element={<div>Tasks Page (Coming Soon)</div>} />
            </Routes>
          </MainLayout>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
