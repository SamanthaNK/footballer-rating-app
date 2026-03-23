import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../theme/theme.js';

const footballImage = require('../../assets/football.png');

export default function Logo({ size = 'sm' }) {
    const isLarge = size === 'lg';

    return (
        <View style={styles.row}>
            <View style={[styles.badge, isLarge && styles.badgeLarge]}>
                <Image
                    source={footballImage}
                    style={isLarge ? styles.imageLarge : styles.imageSmall}
                    resizeMode="contain"
                />
            </View>

            <View>
                <Text style={[styles.line1, isLarge && styles.line1Large]}>RATE THAT</Text>
                <Text style={[styles.line2, isLarge && styles.line2Large]}>BALLER</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FFFFFF44',
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeLarge: {
        width: 56,
        height: 56,
        borderRadius: theme.radius.lg,
    },
    imageSmall: {
        width: 20,
        height: 20,
    },
    imageLarge: {
        width: 34,
        height: 34,
    },
    line1: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 2.5,
        color: '#FFFFFF',
        lineHeight: 13,
    },
    line1Large: {
        fontSize: 15,
        letterSpacing: 3,
        lineHeight: 18,
    },
    line2: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 2.5,
        color: theme.colors.accent,
        lineHeight: 13,
    },
    line2Large: {
        fontSize: 15,
        letterSpacing: 3,
        lineHeight: 18,
    },
});