import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import supabaseService from './services/supabase';
import { Colors } from './theme';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    const { data: authListener } = supabaseService.client.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => { authListener?.subscription.unsubscribe(); };
  }, []);

  const checkAuth = async () => {
    try {
      const session = await supabaseService.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <AppNavigator isAuthenticated={isAuthenticated} />;
};

export default App;
