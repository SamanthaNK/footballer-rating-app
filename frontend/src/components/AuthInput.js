import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme.js';

const ICON_MAP = {
    email: 'mail',
    name: 'user',
    password: 'lock',
    default: 'edit-2',
};

export default function AuthInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoComplete,
    returnKeyType = 'next',
    onSubmitEditing,
    editable = true,
    hasError = false,
    iconType = 'default',
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const iconName = ICON_MAP[iconType] || ICON_MAP.default;

    return (
        <View style={styles.group}>
            <Text style={styles.label}>{label}</Text>

            <View style={[
                styles.inputWrap,
                isFocused && styles.inputWrapFocused,
                hasError && styles.inputWrapError,
                !editable && styles.inputWrapDisabled,
            ]}>
                <Feather
                    name={iconName}
                    size={14}
                    color={isFocused ? theme.colors.accent : theme.colors.textSecondary}
                    style={styles.leftIcon}
                />

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    secureTextEntry={secureTextEntry && !passwordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    autoComplete={autoComplete}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    editable={editable}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setPasswordVisible((prev) => !prev)}
                        style={styles.eyeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Feather
                            name={passwordVisible ? 'eye-off' : 'eye'}
                            size={14}
                            color={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    group: {
        marginBottom: 12,
    },
    label: {
        fontFamily: theme.fonts.body500,
        fontSize: 9,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: theme.colors.textSecondary,
        marginBottom: 5,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingRight: 12,
    },
    inputWrapFocused: {
        borderColor: theme.colors.borderFocus,
        backgroundColor: '#1C2830',
    },
    inputWrapError: {
        borderColor: theme.colors.borderError,
        backgroundColor: theme.colors.errorBg,
    },
    inputWrapDisabled: {
        opacity: 0.4,
    },
    leftIcon: {
        marginLeft: 13,
        marginRight: 2,
    },
    input: {
        flex: 1,
        fontFamily: theme.fonts.body400,
        fontSize: 13,
        color: theme.colors.textPrimary,
        paddingHorizontal: 10,
        paddingVertical: 13,
    },
    eyeButton: {
        paddingLeft: 6,
    },
});