import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import analytics from './services/analytics';
import { Colors } from './theme';

/**
 * App Content Component
 * Separated to access AuthContext
 */
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Initialize analytics
  useEffect(() => {
    analytics.initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <AppNavigator isAuthenticated={isAuthenticated} />;
};

/**
 * Root App Component
 * Wraps app with providers and error boundary
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
