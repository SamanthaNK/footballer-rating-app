import React, { useState } from 'react';
import {
    View, Text, StyleSheet,
    ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../utils/api.js';
import { isValidPassword } from '../utils/validation.js';
import Logo from '../components/Logo.js';
import AuthInput from '../components/AuthInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import AlertBanner from '../components/AlertBanner.js';
import { theme } from '../theme/theme.js';

export default function ResetPasswordScreen({ route, navigation }) {
    const { resetToken } = route.params;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleReset = async () => {
        setError('');

        if (!isValidPassword(newPassword)) {
            setError('Password must be 8+ characters with a letter and a number.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword({ resetToken, newPassword });
            setSuccess('Password updated! Taking you to sign in...');
            setTimeout(() => navigation.navigate('Login'), 2000);
        } catch (e) {
            setError(e?.response?.data?.message || 'Reset failed. Please start over.');
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
                        <Logo size="sm" />
                    </View>

                    <Text style={styles.heading}>Set New Password.</Text>
                    <Text style={styles.subText}>Min 8 characters — include a letter and a number.</Text>

                    <AlertBanner message={success} type="success" />
                    <AlertBanner message={error} type="error" />

                    <AuthInput
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New password"
                        secureTextEntry
                        autoComplete="password-new"
                        iconType="password"
                        editable={!success}
                    />
                    <AuthInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repeat password"
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleReset}
                        iconType="password"
                        editable={!success}
                    />

                    <View style={styles.spacer} />

                    <PrimaryButton
                        label="SET PASSWORD"
                        onPress={handleReset}
                        loading={loading}
                        disabled={!!success}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bgBase },
    scroll: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40, flexGrow: 1 },
    header: { marginBottom: 28 },
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
});