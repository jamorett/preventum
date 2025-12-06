import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/Colors';

// Un componente de tarjeta reutilizable
export default function Card({ icon, title, text }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIconContainer}>
        {icon}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: COLORS.brandPink,
  },
  cardIconContainer: {
      backgroundColor: COLORS.brandLight,
      padding: 12,
      borderRadius: 99, // Círculo
      marginRight: 16,
  },
  cardContent: {
      flex: 1,
  },
  cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.text,
  },
  cardText: {
      fontSize: 14,
      color: COLORS.darkGray,
      marginTop: 4,
  },
});