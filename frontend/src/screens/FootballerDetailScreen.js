import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext.js';
import { footballerApi } from '../utils/api.js';
import RatingCard from '../components/RatingCard.js';
import RatingModal from '../components/RatingModal.js';
import { theme } from '../theme/theme.js';

export default function FootballerDetailScreen({ route, navigation }) {
    const { footballerId, footballer: initialData } = route.params;
    const { user } = useAuth();
    const [footballer, setFootballer] = useState(initialData || null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const ownRating = ratings.find((r) => r.userId === user?.id);

    const fetchDetail = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await footballerApi.getById(footballerId);
            const { footballer: fb, ratings: ratingList, averageRating: avg, totalRatings: total } = res.data;
            setFootballer(fb);
            setRatings(ratingList);
            setAverageRating(avg);
            setTotalRatings(total);
        } catch (e) {
            setError('Could not load player details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [footballerId]);

    const handleRatePress = () => {
        if (!user) {
            navigation.navigate('HomeTab', {
                screen: 'Home',
            });
            return;
        }
        setModalVisible(true);
    };

    const handleRatingSuccess = () => {
        fetchDetail();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
        );
    }

    if (error || !footballer) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error || 'Player not found.'}</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>GO BACK</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { name, club, position, nationality, age, league, photoUrl } = footballer;

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navBackBtn} onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={18} color="#555" />
                </TouchableOpacity>
                <Text style={styles.navTitle} numberOfLines={1}>{name}</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <View style={styles.heroCard}>
                    <View style={styles.photoWrap}>
                        {photoUrl ? (
                            <Image source={{ uri: photoUrl }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Feather name="user" size={36} color={theme.colors.textSecondary} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.playerName}>{name}</Text>
                    <Text style={styles.playerMeta}>{position}  ·  {club}</Text>
                    <View style={styles.tagRow}>
                        {[nationality, league, age ? `Age ${age}` : null]
                            .filter(Boolean)
                            .map((tag) => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))
                        }
                    </View>
                </View>

                <View style={styles.ratingHeader}>
                    <View style={styles.ratingStats}>
                        {averageRating != null ? (
                            <>
                                <Text style={styles.bigScore}>{averageRating.toFixed(1)}</Text>
                                <Text style={styles.outOf}>/10</Text>
                            </>
                        ) : (
                            <Text style={styles.noRatingText}>No ratings yet</Text>
                        )}
                        <Text style={styles.voteCount}>
                            {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.rateBtn} onPress={handleRatePress} activeOpacity={0.85}>
                        <Feather
                            name={ownRating ? 'edit-2' : 'star'}
                            size={13}
                            color={theme.colors.bgBase}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.rateBtnText}>
                            {ownRating ? 'EDIT RATING' : 'RATE PLAYER'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeading}>COMMUNITY RATINGS</Text>

                {ratings.length === 0 ? (
                    <Text style={styles.emptyRatings}>
                        Be the first to rate this player.
                    </Text>
                ) : (
                    ratings.map((r) => (
                        <RatingCard
                            key={r.id}
                            rating={r}
                            currentUserId={user?.id}
                        />
                    ))
                )}

            </ScrollView>

            <RatingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSuccess={handleRatingSuccess}
                footballerId={footballerId}
                existingRating={ownRating
                    ? { ratingId: ownRating.id, score: ownRating.score, review: ownRating.review }
                    : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: theme.colors.bgBase
    },
    center: {
        flex: 1,
        backgroundColor: theme.colors.bgBase,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22
    },
    errorText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: 16
    },
    backBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm
    },
    backBtnText: {
        fontFamily: theme.fonts.display500,
        fontSize: 11,
        letterSpacing: 3,
        color: theme.colors.accent
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    navBackBtn: {
        width: 32, height: 32,
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1, borderColor: '#252525',
        borderRadius: theme.radius.sm,
        alignItems: 'center', justifyContent: 'center',
    },
    navTitle: {
        fontFamily: theme.fonts.display500,
        fontSize: 13, letterSpacing: 2,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        flex: 1, textAlign: 'center', marginHorizontal: 8,
    },

    scroll: { paddingBottom: 40 },

    heroCard: {
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 22,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    photoWrap: {
        width: 90, height: 90,
        borderRadius: 45,
        overflow: 'hidden',
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 2,
        borderColor: theme.colors.accent + '44',
        marginBottom: 14,
    },
    photo: {
        width: '100%',
        height: '100%'
    },
    photoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    playerName: {
        fontFamily: theme.fonts.display700,
        fontSize: 22, letterSpacing: 1.5,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 4,
    },
    playerMeta: {
        fontFamily: theme.fonts.body400,
        fontSize: 12, color: theme.colors.textSecondary,
        marginBottom: 12,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    tag: {
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 10, paddingVertical: 4,
    },
    tagText: {
        fontFamily: theme.fonts.body300,
        fontSize: 10,
        color: theme.colors.textSecondary
    },
    ratingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    ratingStats: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4
    },
    bigScore: {
        fontFamily: theme.fonts.display700,
        fontSize: 38, color: theme.colors.accent,
    },
    outOf: {
        fontFamily: theme.fonts.display400,
        fontSize: 16, color: theme.colors.textSecondary,
        marginBottom: 6,
    },
    noRatingText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13, color: theme.colors.textSecondary,
    },
    voteCount: {
        position: 'absolute',
        bottom: -16,
        left: 0,
        fontFamily: theme.fonts.body300,
        fontSize: 9,
        color: theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    rateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.radius.sm,
    },
    rateBtnText: {
        fontFamily: theme.fonts.display700,
        fontSize: 11, letterSpacing: 2,
        color: theme.colors.bgBase,
    },

    sectionHeading: {
        fontFamily: theme.fonts.body500,
        fontSize: 8, letterSpacing: 3,
        color: theme.colors.textSecondary,
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 10,
    },
    emptyRatings: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 22,
        marginTop: 12,
    },
});