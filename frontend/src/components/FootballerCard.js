import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme.js';

export default function FootballerCard({ footballer, onPress, rank }) {
    const {
        name,
        club,
        position,
        nationality,
        photoUrl,
        averageRating,
        totalRatings,
    } = footballer;

    const rankColor =
        rank === 1 ? '#FFD700' :
            rank === 2 ? '#C0C0C0' :
                rank === 3 ? '#CD7F32' :
                    theme.colors.textSecondary;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>

            {rank != null && (
                <View style={styles.rankBadge}>
                    <Text style={[styles.rankText, { color: rankColor }]}>
                        #{rank}
                    </Text>
                </View>
            )}

            <View style={styles.photoWrap}>
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Feather name="user" size={20} color={theme.colors.textSecondary} />
                    </View>
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.meta} numberOfLines={1}>
                    {position}  ·  {club}
                </Text>
                <Text style={styles.nationality} numberOfLines={1}>{nationality}</Text>
            </View>

            {averageRating != null ? (
                <View style={styles.ratingPill}>
                    <Text style={styles.ratingScore}>{averageRating.toFixed(1)}</Text>
                    <Text style={styles.ratingCount}>{totalRatings} {totalRatings === 1 ? 'vote' : 'votes'}</Text>
                </View>
            ) : (
                <View style={styles.ratingPillEmpty}>
                    <Text style={styles.ratingNone}>—</Text>
                </View>
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        gap: 10,
    },
    rankBadge: {
        width: 28,
        alignItems: 'center',
    },
    rankText: {
        fontFamily: theme.fonts.display700,
        fontSize: 12,
        letterSpacing: 0.5,
    },
    photoWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontFamily: theme.fonts.display500,
        fontSize: 13,
        letterSpacing: 0.5,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
    },
    meta: {
        fontFamily: theme.fonts.body400,
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    nationality: {
        fontFamily: theme.fonts.body300,
        fontSize: 9,
        color: theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    ratingPill: {
        alignItems: 'center',
        backgroundColor: theme.colors.accentDim,
        borderWidth: 1,
        borderColor: theme.colors.accent + '44',
        borderRadius: theme.radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 5,
        minWidth: 52,
    },
    ratingScore: {
        fontFamily: theme.fonts.display700,
        fontSize: 16,
        color: theme.colors.accent,
        letterSpacing: 0.5,
    },
    ratingCount: {
        fontFamily: theme.fonts.body300,
        fontSize: 8,
        color: theme.colors.accent,
        letterSpacing: 0.5,
        marginTop: 1,
    },
    ratingPillEmpty: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 52,
    },
    ratingNone: {
        fontFamily: theme.fonts.display500,
        fontSize: 18,
        color: theme.colors.border,
    },
});