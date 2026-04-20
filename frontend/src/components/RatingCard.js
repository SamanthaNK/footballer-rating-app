import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme.js';

export default function RatingCard({ rating, currentUserId }) {
    const { score, review, createdAt, userId } = rating;
    const isOwn = userId === currentUserId;

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-UK', {
              year: 'numeric', month: 'short', day: 'numeric',
          })
        : '';

    return (
        <View style={[styles.card, isOwn && styles.ownCard]}>
            <View style={styles.header}>
                <View style={[styles.scoreBadge, isOwn && styles.ownScoreBadge]}>
                    <Text style={[styles.scoreText, isOwn && styles.ownScoreText]}>
                        {score}/10
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    {isOwn && (
                        <Text style={styles.ownLabel}>YOUR RATING</Text>
                    )}
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>

            {review ? (
                <Text style={styles.review}>"{review}"</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        padding: 12,
        marginBottom: 8,
        gap: 8,
    },
    ownCard: {
        borderColor: theme.colors.accent + '44',
        backgroundColor: theme.colors.accentDim,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    scoreBadge: {
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    ownScoreBadge: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },
    scoreText: {
        fontFamily: theme.fonts.display700,
        fontSize: 14,
        color: theme.colors.textPrimary,
        letterSpacing: 0.5,
    },
    ownScoreText: {
        color: theme.colors.bgBase,
    },
    headerRight: {
        flex: 1,
        gap: 2,
    },
    ownLabel: {
        fontFamily: theme.fonts.body500,
        fontSize: 8,
        letterSpacing: 2,
        color: theme.colors.accent,
    },
    date: {
        fontFamily: theme.fonts.body300,
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    review: {
        fontFamily: theme.fonts.body300,
        fontSize: 12,
        color: theme.colors.textSecondary,
        lineHeight: 18,
        fontStyle: 'italic',
    },
});