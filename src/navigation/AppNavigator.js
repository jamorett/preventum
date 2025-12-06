import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

import FeedScreen from '../screens/FeedScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import UserProfileSetupScreen from '../screens/UserProfileSetupScreen';
import DoctorProfileSetupScreen from '../screens/DoctorProfileSetupScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ManageAvailabilityScreen from '../screens/ManageAvailabilityScreen';
import COLORS from '../constants/Colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UserTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Evaluar') iconName = focused ? 'clipboard' : 'clipboard-outline';
                    else if (route.name === 'Citas') iconName = focused ? 'calendar' : 'calendar-outline';
                    else if (route.name === 'Juegos') iconName = focused ? 'game-controller' : 'game-controller-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.brandActive,
                tabBarInactiveTintColor: COLORS.brandInactive,
                headerShown: false,
            })}
        >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Evaluar" component={AssessmentScreen} />
            <Tab.Screen name="Citas" component={AppointmentsScreen} />
            <Tab.Screen name="Juegos" component={GamesScreen} />
            <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
}

function DoctorDashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DoctorDashboard" component={DoctorDashboardScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="ManageAvailability" component={ManageAvailabilityScreen} />
            <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        </Stack.Navigator>
    );
}

function DoctorTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') iconName = focused ? 'medkit' : 'medkit-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.brandActive,
                tabBarInactiveTintColor: COLORS.brandInactive,
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={DoctorDashboardStack} />
            <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { userData } = useContext(AuthContext);

    if (!userData) return null;

    if (!userData.isProfileComplete) {
        if (userData.role === 'user') {
            return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="ProfileSetup" component={UserProfileSetupScreen} />
                </Stack.Navigator>
            );
        } else if (userData.role === 'doctor') {
            return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="DoctorProfileSetup" component={DoctorProfileSetupScreen} />
                </Stack.Navigator>
            );
        }
    }

    return userData.role === 'doctor' ? <DoctorTabs /> : <UserTabs />;
}