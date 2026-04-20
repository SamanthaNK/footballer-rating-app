import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen.js';
import FootballerDetailScreen from '../screens/FootballerDetailScreen.js';
import LeaderboardScreen from '../screens/LeaderboardScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import { theme } from '../theme/theme.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: theme.colors.bgBase },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="FootballerDetail" component={FootballerDetailScreen} />
        </Stack.Navigator>
    );
}

function TabIcon({ name, focused }) {
    return (
        <Feather
            name={name}
            size={20}
            color={focused ? theme.colors.accent : theme.colors.textSecondary}
        />
    );
}

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.colors.accent,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Players',
                    tabBarIcon: ({ focused }) => <TabIcon name="users" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    title: 'Top Rated',
                    tabBarIcon: ({ focused }) => <TabIcon name="award" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'My Profile',
                    tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: theme.colors.bgElevated,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 6,
        paddingBottom: 8,
        height: 60,
    },
    tabLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 9,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 2,
    },
});