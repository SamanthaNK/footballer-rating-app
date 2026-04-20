import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.js';
import AuthNavigator from './AuthNavigator.js';
import MainNavigator from './MainNavigator.js';
import SplashScreen from '../screens/SplashScreen.js';

export default function AppNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}