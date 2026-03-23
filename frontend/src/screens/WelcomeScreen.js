import React from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet,
    StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

const { width, height } = Dimensions.get('window');

const messiImage = require('../../assets/messi.png');

function SlateTexture() {
    const DOT_SPACING = 18;
    const DOT_SIZE = 1.2;

    const cols = Math.ceil(width / DOT_SPACING);
    const rows = Math.ceil(height * 0.62 / DOT_SPACING);

    const dots = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            dots.push(
                <View
                    key={`${row}-${col}`}
                    style={[
                        styles.dot,
                        {
                            left: col * DOT_SPACING,
                            top: row * DOT_SPACING,
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            borderRadius: DOT_SIZE / 2,
                        },
                    ]}
                />
            );
        }
    }
    return <View style={styles.textureLayer} pointerEvents="none">{dots}</View>;
}

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
            <Image source={messiImage} style={styles.heroImage} resizeMode="cover" />
            <SlateTexture />
            <View style={styles.fade} pointerEvents="none" />

            <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
                <View style={styles.content}>
                    <Logo size="sm" />
                    <Text style={styles.headline}>The World's Best.</Text>
                    <View style={styles.cyanRule} />

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
                        By continuing you agree to our{' '}
                        <Text style={styles.termsLink}>Terms</Text>
                        {' '}&{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>.
                    </Text>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
    },

    heroImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: height * 0.62,
    },

    textureLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.62,
        overflow: 'hidden',
    },
    dot: {
        position: 'absolute',
        backgroundColor: '#12181B',
        opacity: 0.35,
    },

    fade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.55,
        backgroundColor: theme.colors.bgBase,
        opacity: 0,
    },

    bottomSafe: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        paddingHorizontal: 22,
        paddingBottom: 28,
        paddingTop: 32,
        backgroundColor: theme.colors.bgBase,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },

    headline: {
        fontFamily: theme.fonts.display700,
        fontSize: 30,
        letterSpacing: 1.5,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        marginTop: 12,
        marginBottom: 12,
    },

    cyanRule: {
        width: 40,
        height: 2,
        backgroundColor: theme.colors.accent,
        marginBottom: 24,
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
        fontFamily: theme.fonts.display700,
        fontSize: 13,
        letterSpacing: 4,
        color: theme.colors.btnText,
        textTransform: 'uppercase',
    },

    ghostButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingVertical: 13,
        alignItems: 'center',
    },
    ghostButtonText: {
        fontFamily: theme.fonts.display400,
        fontSize: 13,
        letterSpacing: 4,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
    },

    terms: {
        fontFamily: theme.fonts.body300,
        fontSize: 9,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 15,
        marginTop: 12,
        opacity: 0.6,
    },
    termsLink: {
        color: theme.colors.accent,
        opacity: 1,
    },
});