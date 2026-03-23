import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme.js';

export default function AlertBanner({ message, type = 'error' }) {
    if (!message) return null;

    const isError = type === 'error';

    return (
        <View style={styles.row}>
            <Feather
                name={isError ? 'alert-circle' : 'check-circle'}
                size={13}
                color={isError ? theme.colors.error : theme.colors.success}
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
        marginBottom: 12,
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
        color: theme.colors.success,
    },
});