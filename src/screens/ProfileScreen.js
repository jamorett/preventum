import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import COLORS from '../constants/Colors';

export default function ProfileScreen({ navigation }) {
  const { user, userData, logout } = useContext(AuthContext);

  const displayName = userData?.name || user?.displayName || 'Usuario';
  const email = user?.email || 'correo@ejemplo.com';
  const photoURL = user?.photoURL || `https://placehold.co/150x150/FEF6F8/D45D8C?text=${displayName.charAt(0).toUpperCase()}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <ScrollView style={styles.pageContainer} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: photoURL }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.profileMenu}>
            <TouchableOpacity style={styles.profileMenuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="person-outline" size={22} color={COLORS.brandDeep} />
              </View>
              <Text style={styles.profileMenuItemText}>Editar Perfil</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => navigation.navigate('NearbyCenters')}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="location-outline" size={22} color={COLORS.brandDeep} />
              </View>
              <Text style={styles.profileMenuItemText}>Centros Cercanos</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileMenuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="settings-outline" size={22} color={COLORS.brandDeep} />
              </View>
              <Text style={styles.profileMenuItemText}>Configuración</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Profesional</Text>
          <View style={styles.profileMenu}>
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => navigation.navigate('DoctorView')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: COLORS.brandLight }]}>
                <Ionicons name="medkit-outline" size={22} color={COLORS.brandDeep} />
              </View>
              <Text style={styles.profileMenuItemText}>Vista de Doctor (Sim)</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandLight,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.brandPink,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  profileMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  profileMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileMenuItemText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  logoutButtonText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: 'bold',
  },
});