import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext.js';
import { validateRegister } from '../utils/validation.js';
import Logo from '../components/Logo.js';
import AuthInput from '../components/AuthInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import AlertBanner from '../components/AlertBanner.js';
import { theme } from '../theme/theme.js';

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');

        const validationError = validateRegister({ fullName, email, password });
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const result = await register(
                fullName.trim(),
                email.trim().toLowerCase(),
                password,
            );
            navigation.navigate('VerifyEmail', {
                userId: result.userId,
                email: email.trim().toLowerCase(),
            });
        } catch (e) {
            const message =
                e?.response?.data?.message ||
                (e?.message === 'Network Error'
                    ? 'Cannot reach server. Check your connection.'
                    : 'Registration failed. Please try again.');
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

                    <Text style={styles.heading}>Join The Network.</Text>

                    <AlertBanner message={error} type="error" />

                    <AuthInput
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Kim Namjoon"
                        autoCapitalize="words"
                        autoComplete="name"
                        iconType="name"
                    />
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
                        placeholder="Min 8 chars, letter + number"
                        secureTextEntry
                        autoComplete="password-new"
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                        iconType="password"
                    />

                    <View style={styles.spacer} />

                    <PrimaryButton label="REGISTER" onPress={handleRegister} loading={loading} />

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Have an account?{' '}
                            <Text style={styles.linkAccent}>Click Here</Text>
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
        textTransform: 'uppercase',
        marginBottom: 22,
    },
    spacer: { flex: 1, minHeight: 20 },
    linkRow: { alignItems: 'center', paddingVertical: 14 },
    linkText: {
        fontFamily: theme.fonts.body400,
        fontSize: 10, letterSpacing: 1.5,
        color: '#333', textTransform: 'uppercase',
    },
    linkAccent: { color: '#606060', fontFamily: theme.fonts.body500 },
});