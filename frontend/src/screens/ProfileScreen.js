import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext.js';
import { userApi, ratingApi } from '../utils/api.js';
import RatingCard from '../components/RatingCard.js';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            const res = await userApi.getProfile(user.id);
            setProfile(res.data.user);
            setRatings(res.data.ratings || []);
        } catch (e) {
            setError('Could not load your profile.');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleDelete = (ratingId) => {
        Alert.alert(
            'Delete Rating',
            'Are you sure you want to remove this rating?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(ratingId);
                        try {
                            await ratingApi.delete(ratingId);
                            setRatings((prev) => prev.filter((r) => r.id !== ratingId));
                        } catch (e) {
                            Alert.alert('Error', e?.response?.data?.message || 'Could not delete rating.');
                        } finally {
                            setDeleting(null);
                        }
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout },
            ]
        );
    };

    const renderRating = ({ item }) => (
        <View style={styles.ratingRow}>
            <View style={styles.ratingCardWrap}>
                <RatingCard rating={item} currentUserId={user?.id} />
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                {deleting === item.id
                    ? <ActivityIndicator size="small" color={theme.colors.error} />
                    : <Feather name="trash-2" size={14} color={theme.colors.error} />
                }
            </TouchableOpacity>
        </View>
    );

    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long',
        })
        : '';

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />

            <View style={styles.header}>
                <Logo size="sm" />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Feather name="log-out" size={14} color={theme.colors.textSecondary} />
                    <Text style={styles.logoutText}>LOG OUT</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
                        <Text style={styles.retryText}>RETRY</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={ratings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRating}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.profileHeader}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {(profile?.fullName || user?.fullName || '?')
                                        .split(' ')
                                        .map((w) => w[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                </Text>
                            </View>

                            <Text style={styles.fullName}>
                                {profile?.fullName || user?.fullName}
                            </Text>
                            <Text style={styles.email}>
                                {profile?.email || user?.email}
                            </Text>
                            {joinedDate ? (
                                <Text style={styles.joined}>Member since {joinedDate}</Text>
                            ) : null}

                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNumber}>{ratings.length}</Text>
                                    <Text style={styles.statLabel}>RATINGS</Text>
                                </View>
                            </View>

                            <Text style={styles.sectionHeading}>MY RATINGS</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            You haven't rated any players yet
                        </Text>
                    }
                />
            )}
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 22
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
    },
    logoutText: {
        fontFamily: theme.fonts.body500,
        fontSize: 9,
        letterSpacing: 2,
        color: theme.colors.textSecondary,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: 16,
    },
    avatar: {
        width: 72, height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.accentDim,
        borderWidth: 2,
        borderColor: theme.colors.accent + '44',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    avatarText: {
        fontFamily: theme.fonts.display700,
        fontSize: 22, letterSpacing: 2,
        color: theme.colors.accent,
    },
    fullName: {
        fontFamily: theme.fonts.display700,
        fontSize: 20, letterSpacing: 1.5,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    email: {
        fontFamily: theme.fonts.body300,
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    joined: {
        fontFamily: theme.fonts.body300,
        fontSize: 10,
        color: theme.colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingHorizontal: 28,
        paddingVertical: 12,
    },
    statNumber: {
        fontFamily: theme.fonts.display700,
        fontSize: 24,
        color: theme.colors.accent,
    },
    statLabel: {
        fontFamily: theme.fonts.body500,
        fontSize: 8, letterSpacing: 2,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    sectionHeading: {
        fontFamily: theme.fonts.body500,
        fontSize: 8, letterSpacing: 3,
        color: theme.colors.textSecondary,
        alignSelf: 'flex-start',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingCardWrap: {
        flex: 1
    },
    deleteBtn: {
        padding: 6,
        marginBottom: 8,
    },
    emptyText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 24,
    },
    errorText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13, color: theme.colors.error,
        textAlign: 'center', marginBottom: 16,
    },
    retryBtn: {
        paddingHorizontal: 24, paddingVertical: 10,
        borderWidth: 1, borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
    },
    retryText: {
        fontFamily: theme.fonts.display500,
        fontSize: 11, letterSpacing: 3,
        color: theme.colors.accent,
    },
});