import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { leaderboardApi } from '../utils/api.js';
import FootballerCard from '../components/FootballerCard.js';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

export default function LeaderboardScreen({ navigation }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await leaderboardApi.getTop20();
            setLeaderboard(res.data.leaderboard || []);
        } catch (e) {
            setError('Could not load leaderboard. Try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const handlePress = (footballer) => {
        navigation.navigate('HomeTab', {
            screen: 'FootballerDetail',
            params: { footballerId: footballer.id, footballer },
        });
    };

    const renderItem = ({ item, index }) => (
        <FootballerCard
            footballer={item}
            onPress={() => handlePress(item)}
            rank={index + 1}
        />
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />

            {/* Header */}
            <View style={styles.header}>
                <Logo size="sm" />
                <Text style={styles.headerTitle}>TOP RATED</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchLeaderboard}>
                        <Text style={styles.retryText}>RETRY</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={leaderboard}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No rated players yet.</Text>
                    }
                    ListHeaderComponent={
                        <Text style={styles.subheading}>
                            Top 20 footballers ranked by community rating
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bgBase },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        fontFamily: theme.fonts.display700,
        fontSize: 11, letterSpacing: 3,
        color: theme.colors.textSecondary,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22 },
    list: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 20 },
    subheading: {
        fontFamily: theme.fonts.body300,
        fontSize: 11,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginVertical: 12,
    },
    emptyText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 40,
    },
    errorText: {
        fontFamily: theme.fonts.body300,
        fontSize: 13,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: 16,
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