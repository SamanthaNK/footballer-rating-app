import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../theme/theme.js';

export default function PrimaryButton({ label, onPress, loading, disabled }) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
        >
            {loading ? (
                <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#555" />
                    <Text style={styles.loadingText}>{label}</Text>
                </View>
            ) : (
                <Text style={[styles.text, isDisabled && styles.textDisabled]}>{label}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: theme.colors.btnBg,
        borderRadius: theme.radius.sm,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    text: {
        fontFamily: theme.fonts.display500,
        fontSize: 13,
        letterSpacing: 4,
        color: theme.colors.btnText,
        textTransform: 'uppercase',
    },
    textDisabled: {
        color: '#404040',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loadingText: {
        fontFamily: theme.fonts.display500,
        fontSize: 13,
        letterSpacing: 4,
        color: '#404040',
        textTransform: 'uppercase',
    },
});