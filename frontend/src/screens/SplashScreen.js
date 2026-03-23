import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar } from 'react-native';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

export default function SplashScreen() {
    const dot1 = useRef(new Animated.Value(0.15)).current;
    const dot2 = useRef(new Animated.Value(0.15)).current;
    const dot3 = useRef(new Animated.Value(0.15)).current;

    useEffect(() => {
        const pulseDot = (dot, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, { toValue: 0.7, duration: 400, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0.15, duration: 400, useNativeDriver: true }),
                    Animated.delay(800 - delay),
                ])
            );

        const anim1 = pulseDot(dot1, 0);
        const anim2 = pulseDot(dot2, 200);
        const anim3 = pulseDot(dot3, 400);

        anim1.start();
        anim2.start();
        anim3.start();

        return () => { anim1.stop(); anim2.stop(); anim3.stop(); };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
            <Logo size="lg" />
            <View style={styles.dotsRow}>
                {[dot1, dot2, dot3].map((dot, index) => (
                    <Animated.View key={index} style={[styles.dot, { opacity: dot }]} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: theme.colors.accent,
    },
});