import React from 'react';
import { View, Platform } from 'react-native';
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
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 12, 
              backgroundColor: focused ? Colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="dashboard" size={focused ? 26 : 24} color={color} />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Campaigns" 
        component={CampaignsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 12, 
              backgroundColor: focused ? Colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="campaign" size={focused ? 26 : 24} color={color} />
            </View>
          ),
          tabBarLabel: 'Campaigns',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 12, 
              backgroundColor: focused ? Colors.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="person" size={focused ? 26 : 24} color={color} />
            </View>
          ),
          tabBarLabel: 'Profile',
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
