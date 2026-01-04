// src/App.tsx

import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register'>( 'home' );

  if ( isAuthenticated ) {
    return <GamesPage />;
  }

  if ( currentPage === 'home' ) {
    return (
      <HomePage
        onGetStarted={() => setCurrentPage( 'register' )}
        onLogin={() => setCurrentPage( 'login' )}
      />
    );
  }

  if ( currentPage === 'login' ) {
    return <LoginPage onToggle={() => setCurrentPage( 'register' )} />;
  }

  return <RegisterPage onToggle={() => setCurrentPage( 'login' )} />;
};

export default App;