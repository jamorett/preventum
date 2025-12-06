import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function NearbyCentersScreen() {
  // Default location (e.g., city center) since we removed expo-location
  const [location, setLocation] = useState({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324
    }
  });

  // Mock centers data
  const centers = [
    { id: 1, title: 'Centro de Salud Mujer', description: 'Especialistas en oncología', coordinate: { latitude: 37.78825, longitude: -122.4324 } },
    { id: 2, title: 'Clínica Vida', description: 'Mamografías gratuitas', coordinate: { latitude: 37.78925, longitude: -122.4344 } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centros Cercanos</Text>
        <Text style={styles.headerSubtitle}>Encuentra ayuda profesional cerca de ti</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Ubicación por defecto"
            pinColor={COLORS.brandPink}
          />
          {centers.map(center => (
            <Marker
              key={center.id}
              coordinate={center.coordinate}
              title={center.title}
              description={center.description}
            />
          ))}
        </MapView>
      </View>
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
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    backgroundColor: COLORS.white,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});