import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme.js';

export default function AlertBanner({ message, type = 'error' }) {
    if (!message) return null;

    const isError = type === 'error';

    return (
        <View style={[styles.row, isError ? styles.errorRow : styles.successRow]}>
            <Feather
                name={isError ? 'alert-circle' : 'check-circle'}
                size={13}
                color={isError ? theme.colors.error : theme.colors.accent}
                style={styles.icon}
            />
            <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginBottom: 14,
    },
    errorRow: {
        backgroundColor: theme.colors.errorBg,
        borderColor: theme.colors.errorBorder,
    },
    successRow: {
        backgroundColor: theme.colors.successBg,
        borderColor: theme.colors.successBorder,
    },
    icon: {
        marginRight: 8,
        marginTop: 1,
    },
    text: {
        fontFamily: theme.fonts.body300,
        fontSize: 12,
        lineHeight: 18,
        flex: 1,
    },
    errorText: {
        color: theme.colors.error,
    },
    successText: {
        color: theme.colors.accent,
    },
});