import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, Alert, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function ManageAvailabilityScreen({ navigation }) {
    const { user, userData } = useContext(AuthContext);
    const [slots, setSlots] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;

        // Listen for real-time updates to the doctor's slots
        const q = query(
            collection(db, 'doctor_slots'),
            where('doctorId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedSlots = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                fetchedSlots.push({
                    id: doc.id,
                    ...data,
                    date: data.date.toDate(), // Convert Timestamp to Date
                });
            });
            // Sort by date
            fetchedSlots.sort((a, b) => a.date - b.date);
            setSlots(fetchedSlots);
        }, (error) => {
            console.error("Error fetching slots:", error);
            Alert.alert('Error', 'No se pudieron cargar los horarios.');
        });

        return () => unsubscribe();
    }, [user]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = async (date) => {
        hideDatePicker();

        // Prevent adding slots in the past
        if (date < new Date()) {
            Alert.alert('Error', 'No puedes agregar horarios en el pasado.');
            return;
        }

        setLoading(true);
        try {
            const doctorName = userData?.role === 'doctor' && userData?.name
                ? `Dr. ${userData.name}`
                : userData?.name || user.displayName || 'Doctor';

            await addDoc(collection(db, 'doctor_slots'), {
                doctorId: user.uid,
                doctorName: doctorName,
                specialty: user.specialty || 'General',
                date: date,
                status: 'available', // 'available' or 'booked'
                createdAt: serverTimestamp(),
            });
            Alert.alert('Éxito', 'Horario agregado correctamente.');
        } catch (error) {
            console.error("Error adding slot:", error);
            Alert.alert('Error', 'No se pudo agregar el horario.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = (slotId) => {
        Alert.alert(
            "Eliminar Horario",
            "¿Estás seguro de que quieres eliminar este horario?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'doctor_slots', slotId));
                        } catch (error) {
                            console.error("Error deleting slot:", error);
                            Alert.alert('Error', 'No se pudo eliminar el horario.');
                        }
                    }
                }
            ]
        );
    };

    const renderSlotItem = ({ item }) => (
        <View style={styles.slotCard}>
            <View style={styles.slotInfo}>
                <Ionicons name="time-outline" size={24} color={COLORS.brandDeep} />
                <View style={styles.slotTextContainer}>
                    <Text style={styles.dateText}>
                        {item.date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Text>
                    <Text style={styles.timeText}>
                        {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={[styles.statusText, { color: item.status === 'available' ? COLORS.success : COLORS.error }]}>
                        {item.status === 'available' ? 'Disponible' : 'Reservado'}
                    </Text>
                </View>
            </View>
            {item.status === 'available' && (
                <TouchableOpacity onPress={() => handleDeleteSlot(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.brandDeep} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Horarios</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.addButton}>
                    <Ionicons name="add" size={28} color={COLORS.brandPink} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>
                    Agrega los horarios específicos en los que deseas atender pacientes.
                </Text>

                <FlatList
                    data={slots}
                    renderItem={renderSlotItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No has agregado horarios aún.</Text>
                            <Text style={styles.emptySubtext}>Toca el botón + para agregar uno.</Text>
                        </View>
                    }
                />
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.brandLight,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
    },
    addButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    subtitle: {
        padding: 16,
        color: COLORS.gray,
        fontSize: 14,
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    slotCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    slotInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slotTextContainer: {
        marginLeft: 12,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        textTransform: 'capitalize',
    },
    timeText: {
        fontSize: 14,
        color: COLORS.brandDeep,
        marginTop: 2,
    },
    statusText: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: '600',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: 'bold',
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 8,
    },
});
