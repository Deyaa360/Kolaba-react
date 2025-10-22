import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import CampaignDetailsScreen from '../screens/CampaignDetailsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true, 
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Campaigns" 
        component={CampaignsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="campaign" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CampaignDetails" 
        component={CampaignDetailsScreen}
        options={{ 
          headerShown: true,
          title: 'Campaign Details'
        }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={{ 
          headerShown: true,
          title: 'Product Details'
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator /> : <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
