import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme/theme.js';

export default function OtpInput({ onComplete, disabled }) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const updated = [...digits];
        updated[index] = digit;
        setDigits(updated);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        const fullCode = updated.join('');
        if (fullCode.length === 6) {
            onComplete(fullCode);
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.row}>
            {digits.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[styles.box, digit ? styles.boxFilled : styles.boxEmpty]}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectionColor={theme.colors.accent}
                    editable={!disabled}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 7,
        marginTop: 16,
        marginBottom: 20,
    },
    box: {
        flex: 1,
        height: 52,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        fontFamily: theme.fonts.display500,
        fontSize: 22,
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.bgSurface,
    },
    boxFilled: {
        borderColor: theme.colors.accent,
        color: theme.colors.accent,
    },
    boxEmpty: {
        borderColor: theme.colors.border,
    },
});