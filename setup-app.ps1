# Complete React Native Kolaba Creators App Setup Script
Write-Host "Setting up Kolaba Creators app files..." -ForegroundColor Green

$base = "c:\Users\deyaa\OneDrive\Desktop\apktool\influee\Influee-mock-ugc"

# AppNavigator
$appNav = @'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Text style={{ fontSize: 20, color: Colors.primary, fontWeight: '600' }}>{route.name} Coming Soon</Text>
  </View>
);

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: Colors.primary }}>
      <Tab.Screen name="Dashboard" component={PlaceholderScreen} />
      <Tab.Screen name="Campaigns" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator /> : <MainTabs />}
    </NavigationContainer>
  );
};

export default AppNavigator;
'@

# App.tsx
$appTsx = @'
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import supabaseService from './src/services/supabase';
import { Colors } from './src/theme';

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
'@

# Write files
Set-Content -Path "$base\src\navigation\AppNavigator.tsx" -Value $appNav -Encoding UTF8
Set-Content -Path "$base\App.tsx" -Value $appTsx -Encoding UTF8

Write-Host "✓ AppNavigator.tsx created" -ForegroundColor Cyan
Write-Host "✓ App.tsx created" -ForegroundColor Cyan
Write-Host "`nSetup complete! Next steps:" -ForegroundColor Green
Write-Host "1. Update index.js to use App component"
Write-Host "2. Bundle JavaScript"
Write-Host "3. Build APK"
