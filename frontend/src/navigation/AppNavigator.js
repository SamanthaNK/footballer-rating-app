import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.js';
import AuthNavigator from './AuthNavigator.js';
import SplashScreen from '../screens/SplashScreen.js';
import { theme } from '../theme/theme.js';

function MainApp() {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>You are logged in!</Text>
            <Text style={styles.placeholderSub}>Main app goes here.</Text>
        </View>
    );
}

export default function AppNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainApp /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    placeholder: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    placeholderText: {
        fontFamily: theme.fonts.display500,
        fontSize: 20,
        letterSpacing: 1,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
    },
    placeholderSub: {
        fontFamily: theme.fonts.body300,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});