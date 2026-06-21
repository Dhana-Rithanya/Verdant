import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Trends from './pages/Trends';
import AIInsights from './pages/AIInsights';
import Offsets from './pages/Offsets';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#2D4A2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected app routes */}
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/log" element={<ProtectedLayout><LogActivity /></ProtectedLayout>} />
          <Route path="/trends" element={<ProtectedLayout><Trends /></ProtectedLayout>} />
          <Route path="/insights" element={<ProtectedLayout><AIInsights /></ProtectedLayout>} />
          <Route path="/offsets" element={<ProtectedLayout><Offsets /></ProtectedLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;