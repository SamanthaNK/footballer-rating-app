import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen.js';
import RegisterScreen from '../screens/RegisterScreen.js';
import VerifyEmailScreen from '../screens/VerifyEmailScreen.js';
import LoginScreen from '../screens/LoginScreen.js';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.js';
import VerifyResetCodeScreen from '../screens/VerifyResetCodeScreen.js';
import ResetPasswordScreen from '../screens/ResetPasswordScreen.js';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#0E0E0E' },
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
    );
}