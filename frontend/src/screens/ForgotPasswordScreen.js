import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { authApi } from '../utils/api.js';
import { isValidEmail } from '../utils/validation.js';
import Logo from '../components/Logo.js';
import AuthInput from '../components/AuthInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import AlertBanner from '../components/AlertBanner.js';
import { theme } from '../theme/theme.js';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async () => {
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await authApi.forgotPassword({ email: email.trim().toLowerCase() });
            navigation.navigate('VerifyResetCode', { email: email.trim().toLowerCase() });
        } catch (e) {
            setError(e?.response?.data?.message || 'Something went wrong. Please try again.');
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
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Feather name="chevron-left" size={18} color="#555" />
                        </TouchableOpacity>
                        <Logo size="sm" />
                    </View>

                    <Text style={styles.heading}>Forgot Password?</Text>
                    <Text style={styles.subText}>Enter your email — we'll send you a reset code.</Text>

                    <AlertBanner message={error} type="error" />

                    <AuthInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@email.com"
                        keyboardType="email-address"
                        autoComplete="email"
                        returnKeyType="done"
                        onSubmitEditing={handleSend}
                        iconType="email"
                    />

                    <View style={styles.spacer} />

                    <PrimaryButton label="SEND RESET CODE" onPress={handleSend} loading={loading} />

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.linkText}>
                            Remembered it?{' '}
                            <Text style={styles.linkAccent}>Sign In</Text>
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
        textTransform: 'uppercase', marginBottom: 6,
    },
    subText: {
        fontFamily: theme.fonts.body300,
        fontSize: 12, color: '#444', lineHeight: 18, marginBottom: 20,
    },
    spacer: { flex: 1, minHeight: 24 },
    linkRow: { alignItems: 'center', paddingVertical: 14 },
    linkText: {
        fontFamily: theme.fonts.body400,
        fontSize: 10, letterSpacing: 1.5,
        color: '#333', textTransform: 'uppercase',
    },
    linkAccent: { color: '#606060', fontFamily: theme.fonts.body500 },
});