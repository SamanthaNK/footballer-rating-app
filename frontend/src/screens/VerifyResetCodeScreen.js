import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { authApi } from '../utils/api.js';
import Logo from '../components/Logo.js';
import OtpInput from '../components/OtpInput.js';
import PrimaryButton from '../components/PrimaryButton.js';
import AlertBanner from '../components/AlertBanner.js';
import { theme } from '../theme/theme.js';

export default function VerifyResetCodeScreen({ route, navigation }) {
    const { email } = route.params;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerify = async (enteredCode) => {
        setError('');
        setLoading(true);
        try {
            const res = await authApi.verifyResetCode({ email, code: enteredCode || code });
            navigation.navigate('ResetPassword', { resetToken: res.data.resetToken });
        } catch (e) {
            setError(e?.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        try {
            await authApi.forgotPassword({ email });
            setCountdown(60);
        } catch (e) {
            setError('Could not resend. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Feather name="chevron-left" size={18} color="#555" />
                    </TouchableOpacity>
                    <Logo size="sm" />
                </View>

                <Text style={styles.heading}>Enter Reset Code.</Text>
                <Text style={styles.subText}>
                    Code sent to <Text style={styles.emailText}>{email}</Text>
                </Text>

                <AlertBanner message={error} type="error" />

                <OtpInput
                    onComplete={(fullCode) => {
                        setCode(fullCode);
                        handleVerify(fullCode);
                    }}
                    disabled={loading}
                />

                <PrimaryButton
                    label="VERIFY CODE"
                    onPress={() => handleVerify(code)}
                    loading={loading}
                    disabled={code.length < 6}
                />

                <TouchableOpacity
                    style={styles.resendRow}
                    onPress={handleResend}
                    disabled={countdown > 0}
                >
                    <Text style={styles.resendText}>
                        {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive it? Resend"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
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
    subText: { fontFamily: theme.fonts.body300, fontSize: 12, color: '#444', lineHeight: 18 },
    emailText: { color: '#666', fontFamily: theme.fonts.body400 },
    resendRow: { alignItems: 'center', paddingVertical: 14 },
    resendText: {
        fontFamily: theme.fonts.body300,
        fontSize: 10, letterSpacing: 1,
        color: '#404040', textTransform: 'uppercase',
    },
});