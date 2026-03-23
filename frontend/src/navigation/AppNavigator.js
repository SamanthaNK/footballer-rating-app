import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.js';
import AuthNavigator from './AuthNavigator.js';
import SplashScreen from '../screens/SplashScreen.js';
import { theme } from '../theme/theme.js';

function MainApp() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{user?.fullName}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
                <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
        gap: 4,
    },
    welcomeText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    nameText: {
        fontFamily: theme.fonts.display500,
        fontSize: 26,
        letterSpacing: 1,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        marginBottom: 32,
    },
    logoutButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
    },
    logoutText: {
        fontFamily: theme.fonts.display500,
        fontSize: 12,
        letterSpacing: 4,
        color: theme.colors.accent,
        textTransform: 'uppercase',
    },
});