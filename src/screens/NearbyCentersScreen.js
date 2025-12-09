import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, SectionList, TouchableOpacity, Linking } from 'react-native';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

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
      },
      {
        id: 'iess_ceibos',
        name: 'Hospital Los Ceibos (IESS)',
        address: 'Av. del Bombero, km 6.5 vía a la Costa.',
        phone: '(04) 370-3600',
        note: 'Hospital nuevo con equipamiento moderno. Casos complejos a veces se derivan.',
      },
      {
        id: 'msp_abel',
        name: 'Hospital Guayaquil "Dr. Abel Gilbert Pontón" (MSP)',
        address: 'Calle 29 y Galápagos (Suburbio).',
        phone: '(04) 246-8303',
        department: 'Servicio de Oncología Clínica.',
        note: 'Atención gratuita pero requiere mucha antelación. Hospital de referencia del MSP.',
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
      },
      {
        id: 'kennedy',
        name: 'Grupo Hospitalario Kennedy',
        subtitle: 'Policentro / Samborondón',
        address: 'Policentro: Av. San Jorge y Calle Novena.',
        phone: '(04) 228-9696',
        services: 'Tratamiento integral (quimio ambulatoria) y cirugía.',
      },
      {
        id: 'inter',
        name: 'Interhospital',
        address: 'Av. del Bombero km 6.5 (Vía a la Costa).',
        phone: '(04) 500-0500',
        note: 'Cuentan con Unidad de Oncología moderna ("InterOnco").',
      },
    ],
  },
];

export default function NearbyCentersScreen() {
  const handlePhonePress = (phone) => {
    // Simple cleaner for phone numbers to make them dialable
    // This is basic; for production user might want more robust parsing
    const number = phone.split('/')[0].replace(/[^0-9]/g, '');
    if (number) {
      Linking.openURL(`tel:${number}`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
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

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
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
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
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
    backgroundColor: '#fff5f8', // Light pinkish for note
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
});