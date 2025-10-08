import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Sidebar } from './components/Layout/Sidebar';
import { DataAcquisition } from './components/DataAcquisition/DataAcquisition';
import { DataProcessing } from './components/DataProcessing/DataProcessing';
import { PredictionPanel } from './components/Prediction/PredictionPanel';
import { VisualizationDashboard } from './components/Visualization/VisualizationDashboard';
import { StockData } from './types';

function App() {
  const { user, isAuthenticated, isLoading, login, signup, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeSection, setActiveSection] = useState('data-acquisition');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState('');

  const handleDataFetched = (data: StockData[], symbol: string) => {
    setStockData(data);
    setCurrentSymbol(symbol);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'data-acquisition':
        return <DataAcquisition onDataFetched={handleDataFetched} />;
      case 'data-processing':
        return <DataProcessing stockData={stockData} symbol={currentSymbol} />;
      case 'ai-prediction':
        return <PredictionPanel stockData={stockData} symbol={currentSymbol} />;
      case 'visualization':
        return <VisualizationDashboard stockData={stockData} symbol={currentSymbol} />;
      default:
        return <DataAcquisition onDataFetched={handleDataFetched} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StockPredict AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <LoginForm
          onLogin={login}
          onSwitchToSignup={() => setAuthMode('signup')}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <SignupForm
          onSignup={signup}
          onSwitchToLogin={() => setAuthMode('login')}
          isLoading={isLoading}
        />
      );
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={logout}
        userName={user?.name || 'User'}
      />
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;