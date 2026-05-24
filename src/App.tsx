import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MiningProvider } from './context/MiningContext';
import Layout from './components/Layout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Wallet from './views/Wallet';
import Profile from './views/Profile';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MiningProvider>
        <AppContent />
      </MiningProvider>
    </AuthProvider>
  );
};

export default App;
