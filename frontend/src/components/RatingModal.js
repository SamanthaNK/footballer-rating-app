import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Modal, StyleSheet, KeyboardAvoidingView,
    Platform, Pressable, ActivityIndicator,
} from 'react-native';
import { theme } from '../theme/theme.js';
import { ratingApi } from '../utils/api.js';

export default function RatingModal({
    visible,
    onClose,
    onSuccess,
    footballerId,
    existingRating,
}) {
    const [score, setScore] = useState(existingRating?.score ?? 7);
    const [review, setReview] = useState(existingRating?.review ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            setScore(existingRating?.score ?? 7);
            setReview(existingRating?.review ?? '');
            setError('');
        }
    }, [visible, existingRating]);

    const handleSave = async () => {
        setError('');
        setLoading(true);
        try {
            await ratingApi.submit({ footballerId, score, review: review.trim() });
            onSuccess({ score, review: review.trim() });
            onClose();
        } catch (e) {
            setError(e?.response?.data?.message || 'Could not save rating. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const scoreButtons = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.kvWrapper}
                pointerEvents="box-none"
            >
                <View style={styles.sheet}>

                    <View style={styles.handle} />

                    <Text style={styles.title}>
                        {existingRating ? 'EDIT YOUR RATING' : 'RATE THIS PLAYER'}
                    </Text>

                    <Text style={styles.sectionLabel}>SCORE</Text>
                    <View style={styles.scoreRow}>
                        {scoreButtons.map((n) => (
                            <TouchableOpacity
                                key={n}
                                style={[
                                    styles.scoreBtn,
                                    score === n && styles.scoreBtnActive,
                                ]}
                                onPress={() => setScore(n)}
                                activeOpacity={0.75}
                            >
                                <Text
                                    style={[
                                        styles.scoreBtnText,
                                        score === n && styles.scoreBtnTextActive,
                                    ]}
                                >
                                    {n}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionLabel}>REVIEW (OPTIONAL)</Text>
                    <TextInput
                        style={styles.reviewInput}
                        value={review}
                        onChangeText={setReview}
                        placeholder="What do you think of this player?"
                        placeholderTextColor={theme.colors.textPlaceholder}
                        multiline
                        maxLength={280}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{review.length}/280</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>CANCEL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator size="small" color={theme.colors.bgBase} />
                                : <Text style={styles.saveText}>SAVE RATING</Text>
                            }
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#00000088',
    },
    kvWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: theme.colors.bgElevated,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
        padding: 22,
        paddingBottom: Platform.OS === 'ios' ? 38 : 28,
    },
    handle: {
        width: 36,
        height: 3,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontFamily: theme.fonts.display700,
        fontSize: 15,
        letterSpacing: 3,
        color: theme.colors.textPrimary,
        marginBottom: 20,
    },
    sectionLabel: {
        fontFamily: theme.fonts.body500,
        fontSize: 8,
        letterSpacing: 2.5,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    scoreBtn: {
        width: 36,
        height: 36,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.bgSurface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreBtnActive: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    scoreBtnText: {
        fontFamily: theme.fonts.display500,
        fontSize: 13,
        color: theme.colors.textSecondary,
    },
    scoreBtnTextActive: {
        color: theme.colors.bgBase,
    },
    reviewInput: {
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        padding: 12,
        fontFamily: theme.fonts.body400,
        fontSize: 13,
        color: theme.colors.textPrimary,
        height: 90,
        marginBottom: 4,
    },
    charCount: {
        fontFamily: theme.fonts.body300,
        fontSize: 9,
        color: theme.colors.textSecondary,
        textAlign: 'right',
        marginBottom: 16,
    },
    errorText: {
        fontFamily: theme.fonts.body300,
        fontSize: 11,
        color: theme.colors.error,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 13,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: theme.fonts.display500,
        fontSize: 11,
        letterSpacing: 3,
        color: theme.colors.textSecondary,
    },
    saveBtn: {
        flex: 2,
        paddingVertical: 13,
        backgroundColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveText: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 3,
        color: theme.colors.bgBase,
    },
});