import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Platform, Alert, RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, updateDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'my' (only for patients)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine if the current user is a doctor
  const isDoctor = user?.role === 'doctor';

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    let q;

    if (isDoctor) {
      // DOCTOR VIEW: Show only booked slots for this doctor (My Agenda)
      q = query(
        collection(db, 'doctor_slots'),
        where('doctorId', '==', user.uid),
        where('status', '==', 'booked')
      );
    } else {
      // PATIENT VIEW
      if (activeTab === 'available') {
        // Show all available slots from all doctors
        q = query(
          collection(db, 'doctor_slots'),
          where('status', '==', 'available')
        );
      } else {
        // Show my booked appointments
        q = query(
          collection(db, 'doctor_slots'),
          where('patientId', '==', user.uid),
          where('status', '==', 'booked')
        );
      }
    }

    // Real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedSlots = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter out past slots if they are 'available'
        const date = data.date.toDate();
        if (data.status === 'available' && date < new Date()) {
          return;
        }

        fetchedSlots.push({
          id: doc.id,
          ...data,
          date: date,
        });
      });

      setAppointments(fetchedSlots.sort((a, b) => a.date - b.date));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments:", error);
      setLoading(false);
      Alert.alert('Error', 'No se pudieron cargar las citas en tiempo real.');
    });

    return () => unsubscribe();
  }, [activeTab, user]);

  const handleBook = (slot) => {
    Alert.alert(
      "Confirmar Cita",
      `¿Deseas agendar una cita con ${slot.doctorName} para el ${slot.date.toLocaleDateString()} a las ${slot.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Update the slot document to mark it as booked by this user
              const slotRef = doc(db, 'doctor_slots', slot.id);
              await updateDoc(slotRef, {
                status: 'booked',
                patientId: user.uid,
                patientName: user.displayName || 'Paciente', // Now uses the updated Auth profile name
                bookedAt: serverTimestamp(),
              });

              Alert.alert("Éxito", "Cita agendada correctamente");
              // No need to fetchAppointments(), onSnapshot handles it
            } catch (error) {
              console.error("Error booking appointment:", error);
              Alert.alert("Error", "No se pudo agendar la cita. Es posible que ya no esté disponible.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.slotCard}>
      <View style={styles.slotInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={24} color={COLORS.brandDeep} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.dateText}>
            {item.date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
          </Text>
          <Text style={styles.timeText}>
            {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>

          {isDoctor ? (
            // Doctor sees Patient Name
            <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">
              Paciente: {item.patientName || 'Anónimo'}
            </Text>
          ) : (
            // Patient sees Doctor Name
            <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">
              {item.doctorName} - {item.specialty || 'General'}
            </Text>
          )}

          {!isDoctor && activeTab === 'my' && (
            <Text style={styles.statusText}>Confirmada</Text>
          )}
        </View>
      </View>

      {!isDoctor && activeTab === 'available' && (
        <TouchableOpacity style={styles.bookButton} onPress={() => handleBook(item)}>
          <Text style={styles.bookButtonText}>Agendar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isDoctor ? 'Mi Agenda' : 'Citas Médicas'}</Text>
        <Text style={styles.headerSubtitle}>
          {isDoctor ? 'Tus citas programadas con pacientes' : 'Gestiona tus consultas'}
        </Text>
      </View>

      {!isDoctor && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Disponibles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my' && styles.activeTab]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>Mis Citas</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isDoctor
                ? 'No tienes citas programadas aún.'
                : (activeTab === 'available' ? 'No hay citas disponibles.' : 'No tienes citas agendadas.')
              }
            </Text>
          </View>
        }
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
    padding: 24,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.brandPink,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  slotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  doctorName: {
    fontSize: 14,
    color: COLORS.brandPink,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: COLORS.brandPink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: COLORS.brandPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 16,
    textAlign: 'center',
  },
});