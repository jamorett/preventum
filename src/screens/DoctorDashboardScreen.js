import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorDashboardScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        pendingAppointments: 0,
        totalPatients: 0,
        posts: 0,
    });
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        if (!user?.uid) return;

        try {
            // 1. Pending Appointments (Booked Slots)
            // Query 'doctor_slots' where doctorId == user.uid AND status == 'booked'
            const appointmentsQuery = query(
                collection(db, 'doctor_slots'),
                where('doctorId', '==', user.uid),
                where('status', '==', 'booked')
            );
            const appointmentsSnapshot = await getCountFromServer(appointmentsQuery);

            // 2. My Posts
            const postsQuery = query(
                collection(db, 'posts'),
                where('userId', '==', user.uid)
            );
            const postsSnapshot = await getCountFromServer(postsQuery);

            // 3. Total Patients (Proxy: Total Booked Slots for now)
            // In a real app, you'd count unique patientIds
            const allAppointmentsQuery = query(
                collection(db, 'doctor_slots'),
                where('doctorId', '==', user.uid),
                where('status', '==', 'booked')
            );
            const allAppointmentsSnapshot = await getCountFromServer(allAppointmentsQuery);

            setStats({
                pendingAppointments: appointmentsSnapshot.data().count,
                totalPatients: allAppointmentsSnapshot.data().count,
                posts: postsSnapshot.data().count,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hola,</Text>
                        <Text style={styles.doctorName}>{user?.displayName || 'Doctor'}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Perfil')}>
                        <Ionicons name="person-circle-outline" size={40} color={COLORS.brandDeep} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="calendar" size={24} color="#1565C0" />
                        </View>
                        <Text style={styles.statValue}>{stats.pendingAppointments}</Text>
                        <Text style={styles.statLabel}>Citas Pendientes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="people" size={24} color="#2E7D32" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalPatients}</Text>
                        <Text style={styles.statLabel}>Pacientes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                            <Ionicons name="newspaper" size={24} color="#C2185B" />
                        </View>
                        <Text style={styles.statValue}>{stats.posts}</Text>
                        <Text style={styles.statLabel}>Publicaciones</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ManageAvailability')}>
                        <Ionicons name="time-outline" size={32} color={COLORS.brandDeep} />
                        <Text style={styles.actionText}>Gestionar Horarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreatePost')}>
                        <Ionicons name="create-outline" size={32} color={COLORS.brandDeep} />
                        <Text style={styles.actionText}>Crear Publicación</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Appointments')}>
                        <Ionicons name="calendar-outline" size={32} color={COLORS.brandDeep} />
                        <Text style={styles.actionText}>Ver Agenda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <Ionicons name="chatbubbles-outline" size={32} color={COLORS.brandDeep} />
                        <Text style={styles.actionText}>Mensajes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.brandLight,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: COLORS.gray,
    },
    doctorName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: COLORS.brandDeep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
        marginBottom: 15,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: COLORS.brandDeep,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    actionText: {
        marginTop: 10,
        color: COLORS.brandDeep,
        fontWeight: '600',
        textAlign: 'center',
    },
});
