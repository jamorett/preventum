import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  SectionList,
  TouchableOpacity,
  Linking,
  Modal,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAHSaA7cHx61r216drhRTt0LtmyL15REg0';

// 1. DATOS (Sin cambios)
const CENTERS_DATA = [
  {
    title: '1. Instituciones Especializadas',
    data: [
      {
        id: 'solca',
        name: 'SOLCA Guayaquil',
        fullname: 'Instituto Oncológico Nacional Dr. Juan Tanca Marengo',
        address: 'Av. Pedro Menéndez Gilbert y Atahualpa (Sector La Atarazana).',
        phone: '(04) 371-8300',
        phone2: '1800-SOLCAG',
        services: 'Quimioterapia, Radioterapia, Cirugía Oncológica, Mastología, Cuidados Paliativos.',
        note: 'Nota: Para ser atendido por primera vez, generalmente se requiere una derivación del IESS/MSP o acudir a "Triaje" (Pre-consulta).',
        coords: { latitude: -2.174081, longitude: -79.879824 },
      },
      {
        id: 'poly',
        name: 'Fundación Poly Ugarte',
        description: 'Referente principal para mastología y exámenes de mama.',
        address: 'Calle Boyacá 1313 y Luque (Centro de Guayaquil).',
        phone: '(04) 252-4467',
        phone2: '(04) 232-1268',
        focus: 'Mamografías, ecografías mamarias y consulta con mastólogos.',
        note: 'Si detectan cáncer, suelen derivar al paciente a SOLCA o al IESS con un diagnóstico inicial.',
        coords: { latitude: -2.1934, longitude: -79.8837 },
      },
    ],
  },
  {
    title: '2. Seguridad Social y Salud Pública',
    data: [
      {
        id: 'iess_teodoro',
        name: 'Hospital Teodoro Maldonado Carbo (IESS)',
        address: 'Av. 25 de Julio (Sur de Guayaquil).',
        phone: '(04) 243-1200',
        department: 'Unidad Técnica de Oncología.',
        note: 'Requiere derivación médica a través del sistema de citas del IESS.',
        coords: { latitude: -2.230525, longitude: -79.898900 },
      },
      {
        id: 'iess_ceibos',
        name: 'Hospital Los Ceibos (IESS)',
        address: 'Av. del Bombero, km 6.5 vía a la Costa.',
        phone: '(04) 370-3600',
        note: 'Hospital nuevo con equipamiento moderno. Casos complejos a veces se derivan.',
        coords: { latitude: -2.175951, longitude: -79.941117 },
      },
      {
        id: 'msp_abel',
        name: 'Hospital Guayaquil "Dr. Abel Gilbert Pontón" (MSP)',
        address: 'Calle 29 y Galápagos (Suburbio).',
        phone: '(04) 246-8303',
        department: 'Servicio de Oncología Clínica.',
        note: 'Atención gratuita pero requiere mucha antelación. Hospital de referencia del MSP.',
        coords: { latitude: -2.212629, longitude: -79.930472 },
      },
    ],
  },
  {
    title: '3. Sector Privado',
    data: [
      {
        id: 'omni',
        name: 'Omni Hospital',
        address: 'Av. Abel Romeo Castillo y Juan Tanca Marengo.',
        phone: '(04) 210-9000',
        contact: 'Solicitar conexión con Torre Médica (Oncología/Mastología).',
        coords: { latitude: -2.157196, longitude: -79.891372 },
      },
      {
        id: 'kennedy',
        name: 'Grupo Hospitalario Kennedy',
        subtitle: 'Policentro / Samborondón',
        address: 'Policentro: Av. San Jorge y Calle Novena.',
        phone: '(04) 228-9696',
        services: 'Tratamiento integral (quimio ambulatoria) y cirugía.',
        locations: [
          { label: 'Sede Policentro', coords: { latitude: -2.172618, longitude: -79.898961 } },
          { label: 'Sede Samborondón', coords: { latitude: -2.137992, longitude: -79.864334 } },
        ]
      },
      {
        id: 'inter',
        name: 'Interhospital',
        address: 'Av. del Bombero km 6.5 (Vía a la Costa).',
        phone: '(04) 500-0500',
        note: 'Cuentan con Unidad de Oncología moderna ("InterOnco").',
        coords: { latitude: -2.180742, longitude: -79.944809 },
      },
    ],
  },
];

export default function NearbyCentersScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No podemos mostrar la ruta sin acceso a tu ubicación.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  const handlePhonePress = (phone) => {
    const number = phone.split('/')[0].replace(/[^0-9]/g, '');
    if (number) {
      Linking.openURL(`tel:${number}`);
    }
  };

  const handleOpenMap = (item) => {
    setSelectedCenter(item);
    if (item.locations) {
      setActiveLocation(null);
      setModalVisible(true);
    } else if (item.coords) {
      setActiveLocation({
        name: item.name,
        coords: item.coords
      });
      setModalVisible(true);
    } else {
      alert("Ubicación no disponible por el momento.");
    }
  };

  const selectSubLocation = (loc) => {
    setActiveLocation({
      name: `${selectedCenter.name} (${loc.label})`,
      coords: loc.coords
    });
  };

  const openExternalMapsApp = () => {
    if (!activeLocation) return;

    const lat = activeLocation.coords.latitude;
    const lng = activeLocation.coords.longitude;
    const label = activeLocation.name;

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`
    });

    Linking.openURL(url).catch(err => {
      const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(browserUrl);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => handleOpenMap(item)}
        activeOpacity={0.7}
        style={styles.titleContainer}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Ionicons name="map-outline" size={20} color={COLORS.brandPink} style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {item.fullname && <Text style={styles.cardSubtitle}>{item.fullname}</Text>}
      {item.subtitle && <Text style={styles.cardSubtitle}>{item.subtitle}</Text>}

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={18} color={COLORS.brandPink} />
        <Text style={styles.infoText}>{item.address}</Text>
      </View>

      {item.phone && (
        <TouchableOpacity style={styles.infoRow} onPress={() => handlePhonePress(item.phone)}>
          <Ionicons name="call-outline" size={18} color={COLORS.brandPink} />
          <Text style={[styles.infoText, styles.linkText]}>
            {item.phone} {item.phone2 ? `/ ${item.phone2}` : ''}
          </Text>
        </TouchableOpacity>
      )}

      {item.services && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Servicios:</Text>
          <Text style={styles.detailText}>{item.services}</Text>
        </View>
      )}

      {item.focus && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Enfoque:</Text>
          <Text style={styles.detailText}>{item.focus}</Text>
        </View>
      )}

      {item.department && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Departamento:</Text>
          <Text style={styles.detailText}>{item.department}</Text>
        </View>
      )}

      {item.contact && (
        <Text style={styles.noteText}>{item.contact}</Text>
      )}

      {item.note && (
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.gray} style={{ marginTop: 2 }} />
          <Text style={styles.noteText}>{item.note}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centros de Ayuda</Text>
        <Text style={styles.headerSubtitle}>Directorio de instituciones oncológicas</Text>
      </View>

      <SectionList
        sections={CENTERS_DATA}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>

          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              {selectedCenter?.locations && activeLocation && (
                <TouchableOpacity
                  onPress={() => setActiveLocation(null)}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.brandPink} />
                </TouchableOpacity>
              )}

              <Text style={styles.modalTitle} numberOfLines={1}>
                {activeLocation ? activeLocation.name : 'Seleccione una sede'}
              </Text>

              {selectedCenter?.locations && activeLocation && <View style={{ width: 24 }} />}
            </View>

            {activeLocation ? (
              <View style={{ flex: 1 }}>
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  initialRegion={{
                    latitude: activeLocation.coords.latitude,
                    longitude: activeLocation.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  <Marker
                    coordinate={activeLocation.coords}
                    title={activeLocation.name}
                    description={selectedCenter?.address}
                  />

                  {userLocation && (
                    <MapViewDirections
                      origin={userLocation}
                      destination={activeLocation.coords}
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={4}
                      strokeColor={COLORS.brandPink}
                      onReady={result => {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                          edgePadding: { right: 50, bottom: 50, left: 50, top: 50 },
                        });
                      }}
                    />
                  )}
                </MapView>

                {/* BOTÓN ACTUALIZADO */}
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={openExternalMapsApp}
                >
                  <Ionicons name="navigate-circle" size={24} color="white" />
                  <Text style={styles.navigateButtonText}>Iniciar ruta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectionContainer}>
                <Text style={styles.selectionTitle}>
                  {selectedCenter?.name} cuenta con varias instalaciones. Por favor elija una:
                </Text>
                {selectedCenter?.locations?.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectionButton}
                    onPress={() => selectSubLocation(loc)}
                  >
                    <Ionicons name="location-sharp" size={24} color={COLORS.white} />
                    <Text style={styles.selectionButtonText}>{loc.label}</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

          </View>
        </View>
      </Modal>

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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: COLORS.brandLight,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.secondaryText,
    flex: 1,
  },
  linkText: {
    color: COLORS.brandPink,
    fontWeight: '600',
  },
  detailContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
  },
  noteContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#fff5f8',
    padding: 8,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.brandDeep,
    marginLeft: 6,
    flex: 1,
    fontStyle: 'italic',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    height: '75%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.white,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.brandPink,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    paddingRight: 10,
  },
  map: {
    flex: 1,
  },
  selectionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  selectionTitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandPink,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectionButtonText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // === ESTILOS MODIFICADOS PARA EL BOTÓN ===
  navigateButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.brandPink, // Color rosa
    opacity: 0.9, // Transparencia (0.9 es "un poco transparentoso")
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  navigateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});