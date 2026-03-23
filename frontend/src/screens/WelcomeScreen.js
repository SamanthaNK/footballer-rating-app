import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

const { height } = Dimensions.get('window');

const features = [
    { icon: 'star-outline', title: 'Rate Players', subtitle: 'Share your ratings' },
    { icon: 'podium-outline', title: 'Track Rankings', subtitle: "See who's on top" },
];

export default function WelcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />

            <View style={styles.content}>
                <Logo size="sm" />

                <Text style={styles.headline}>
                    Rate and review the world's best footballers
                </Text>

                <View style={styles.featureList}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featurePill}>
                            <Ionicons name={feature.icon} size={16} color="#484848" />
                            <View style={styles.featureText}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.88}
                >
                    <Text style={styles.primaryButtonText}>SIGN UP FREE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ghostButton}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.75}
                >
                    <Text style={styles.ghostButtonText}>LOG IN</Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                    By signing up you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Use</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 22,
        paddingBottom: 28,
    },
    headline: {
        fontFamily: theme.fonts.display400,
        fontSize: 22,
        letterSpacing: 0.5,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        marginTop: 14,
        marginBottom: 16,
    },
    featureList: {
        gap: 8,
        marginBottom: 24,
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    featureText: {
        gap: 2,
    },
    featureTitle: {
        fontFamily: theme.fonts.display500,
        fontSize: 12,
        letterSpacing: 1,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
    },
    featureSubtitle: {
        fontFamily: theme.fonts.body300,
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: theme.colors.btnBg,
        borderRadius: theme.radius.md,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 8,
    },
    primaryButtonText: {
        fontFamily: theme.fonts.display500,
        fontSize: 13,
        letterSpacing: 3,
        color: theme.colors.btnText,
        textTransform: 'uppercase',
    },
    ghostButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: theme.radius.md,
        paddingVertical: 13,
        alignItems: 'center',
    },
    ghostButtonText: {
        fontFamily: theme.fonts.display400,
        fontSize: 13,
        letterSpacing: 3,
        color: '#444',
        textTransform: 'uppercase',
    },
    terms: {
        fontFamily: theme.fonts.body300,
        fontSize: 9,
        color: '#2E2E2E',
        textAlign: 'center',
        lineHeight: 15,
        marginTop: 11,
    },
    termsLink: {
        color: '#444',
    },
});