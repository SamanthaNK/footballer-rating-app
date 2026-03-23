import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext.js';
import { validateLogin } from '../utils/validation.js';
import Logo from '../components/Logo.js';
import AuthInput from '../components/AuthInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import AlertBanner from '../components/AlertBanner.js';
import { theme } from '../theme/theme.js';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');

        const validationError = validateLogin({ email, password });
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await login(email.trim().toLowerCase(), password);
        } catch (e) {
            if (e?.response?.status === 403) {
                setError('Please verify your email before logging in.');
                return;
            }
            const message =
                e?.response?.data?.message ||
                (e?.message === 'Network Error'
                    ? 'Cannot reach server. Check your connection.'
                    : 'Login failed. Please try again.');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Feather name="chevron-left" size={18} color="#555" />
                        </TouchableOpacity>
                        <Logo size="sm" />
                    </View>

                    <Text style={styles.heading}>Welcome Back.</Text>

                    <AlertBanner message={error} type="error" />

                    <AuthInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@email.com"
                        keyboardType="email-address"
                        autoComplete="email"
                        iconType="email"
                    />
                    <AuthInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Your password"
                        secureTextEntry
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                        iconType="password"
                    />

                    <TouchableOpacity
                        style={styles.forgotRow}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <View style={styles.spacer} />

                    <PrimaryButton label="SIGN IN" onPress={handleLogin} loading={loading} />

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.linkText}>
                            No account?{' '}
                            <Text style={styles.linkAccent}>Register Here</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bgBase },
    scroll: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40, flexGrow: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
    backButton: {
        width: 32, height: 32,
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1, borderColor: '#252525',
        borderRadius: theme.radius.sm,
        alignItems: 'center', justifyContent: 'center',
    },
    heading: {
        fontFamily: theme.fonts.display500,
        fontSize: 28, letterSpacing: 1,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase', marginBottom: 22,
    },
    forgotRow: { alignItems: 'flex-end', marginTop: 2, marginBottom: 18 },
    forgotText: { fontFamily: theme.fonts.body400, fontSize: 10, color: '#404040' },
    spacer: { flex: 1, minHeight: 20 },
    linkRow: { alignItems: 'center', paddingVertical: 14 },
    linkText: {
        fontFamily: theme.fonts.body400,
        fontSize: 10, letterSpacing: 1.5,
        color: '#333', textTransform: 'uppercase',
    },
    linkAccent: { color: '#606060', fontFamily: theme.fonts.body500 },
});