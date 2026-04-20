import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, FlatList, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { footballerApi } from '../utils/api.js';
import FootballerCard from '../components/FootballerCard.js';
import Logo from '../components/Logo.js';
import { theme } from '../theme/theme.js';

const SEARCH_DELAY = 400;

export default function HomeScreen({ navigation }) {

    const [footballers, setFootballers] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [listError, setListError] = useState('');
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const isFetchingRef = useRef(false);
    const debounceRef = useRef(null);
    const isInSearchMode = query.trim().length > 0;

    useEffect(() => {
        fetchPage(null);
    }, []);

    const fetchPage = async (nextCursor) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        if (nextCursor) {
            setLoadingMore(true);
        } else {
            setLoadingList(true);
        }
        setListError('');

        try {
            const res = await footballerApi.getAll(20, nextCursor);
            const { footballers: newItems, nextCursor: newCursor } = res.data;

            setFootballers((prev) =>
                nextCursor ? [...prev, ...newItems] : newItems
            );
            setCursor(newCursor);
            setHasMore(!!newCursor);
        } catch (e) {
            setListError('Could not load players. Check your connection.');
        } finally {
            setLoadingList(false);
            setLoadingMore(false);
            isFetchingRef.current = false;
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query.trim()) {
            setSearchResults([]);
            setSearchError('');
            return;
        }

        debounceRef.current = setTimeout(() => runSearch(query.trim()), SEARCH_DELAY);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const runSearch = async (term) => {
        setIsSearching(true);
        setSearchError('');
        try {
            const res = await footballerApi.search({ q: term });
            setSearchResults(res.data.footballers || []);
        } catch (e) {
            setSearchError('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handlePress = (footballer) => {
        navigation.navigate('FootballerDetail', {
            footballerId: footballer.id,
            footballer,
        });
    };

    const renderCard = ({ item }) => (
        <FootballerCard footballer={item} onPress={() => handlePress(item)} />
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.moreLoader}>
                <ActivityIndicator size="small" color={theme.colors.accent} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loadingList || isSearching) return null;
        const msg = isInSearchMode
            ? 'No players found for that search.'
            : 'No players available.';
        return <Text style={styles.emptyText}>{msg}</Text>;
    };

    const dataToShow = isInSearchMode ? searchResults : footballers;

    if (loadingList) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
                <View style={styles.header}>
                    <Logo size="sm" />
                    <Text style={styles.headerTitle}>PLAYERS</Text>
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.accent} />
                </View>
            </SafeAreaView>
        );
    }

    if (listError && footballers.length === 0) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />
                <View style={styles.header}>
                    <Logo size="sm" />
                    <Text style={styles.headerTitle}>PLAYERS</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{listError}</Text>
                    <TouchableOpacity
                        style={styles.retryBtn}
                        onPress={() => fetchPage(null)}
                    >
                        <Text style={styles.retryText}>RETRY</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.bgBase} />

            <View style={styles.header}>
                <Logo size="sm" />
                <Text style={styles.headerTitle}>PLAYERS</Text>
            </View>

            <View style={styles.searchRow}>
                <View style={styles.searchWrap}>
                    <Feather
                        name="search"
                        size={14}
                        color={theme.colors.textSecondary}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search by name, club, nationality..."
                        placeholderTextColor={theme.colors.textPlaceholder}
                        autoCapitalize="none"
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                    {isSearching && (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.accent}
                            style={styles.searchSpinner}
                        />
                    )}
                </View>
            </View>

            {searchError ? (
                <Text style={styles.inlineError}>{searchError}</Text>
            ) : null}

            <FlatList
                data={dataToShow}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.list}
                onEndReached={() => {
                    if (!isInSearchMode && hasMore && !isFetchingRef.current) {
                        fetchPage(cursor);
                    }
                }}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
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
    headerTitle: {
        fontFamily: theme.fonts.display700,
        fontSize: 11,
        letterSpacing: 3,
        color: theme.colors.textSecondary,
    },
    searchRow: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.bgSurface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingRight: 10,
    },
    searchIcon: {
        marginLeft: 12,
        marginRight: 6
    },
    searchInput: {
        flex: 1,
        fontFamily: theme.fonts.body400,
        fontSize: 13,
        color: theme.colors.textPrimary,
        paddingVertical: 11,
        paddingHorizontal: 6,
    },
    searchSpinner: {
        marginLeft: 6
    },
    inlineError: {
        fontFamily: theme.fonts.body300,
        fontSize: 11,
        color: theme.colors.error,
        textAlign: 'center',
        paddingVertical: 8,
    },
    list: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20
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
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
    },
    retryText: {
        fontFamily: theme.fonts.display500,
        fontSize: 11,
        letterSpacing: 3,
        color: theme.colors.accent,
    },
    moreLoader: {
        paddingVertical: 16,
        alignItems: 'center'
    },
});