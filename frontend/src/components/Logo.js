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
        gap: 8,
    },
    badge: {
        width: 30,
        height: 30,
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: '#2E2E2E',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeLarge: {
        width: 54,
        height: 54,
        borderRadius: 13,
    },
    imageSmall: {
        width: 18,
        height: 18,
    },
    imageLarge: {
        width: 32,
        height: 32,
    },
    line1: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 2,
        color: '#FFFFFF',
        lineHeight: 13,
    },
    line1Large: {
        fontSize: 14,
        letterSpacing: 3,
        lineHeight: 17,
    },
    line2: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 2,
        color: '#FFFFFF',
        lineHeight: 13,
    },
    line2Large: {
        fontSize: 14,
        letterSpacing: 3,
        lineHeight: 17,
    },
});