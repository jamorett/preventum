import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, Image, StatusBar, Platform } from 'react-native';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Datos del cuestionario
const questions = [
  {
    id: 'q1',
    text: '¿Realizas autoexámenes de mama mensuales?',
    options: ['Sí, regularmente', 'A veces', 'No, nunca']
  },
  {
    id: 'q2',
    text: '¿Has notado algún bulto, cambio en la textura o secreción?',
    options: ['Sí', 'No', 'No estoy segura']
  },
  {
    id: 'q3',
    text: '¿Tienes antecedentes familiares directos (madre, hermana) de cáncer de mama?',
    options: ['Sí', 'No', 'No lo sé']
  },
  {
    id: 'q4',
    text: '¿Cuándo fue tu última mamografía o chequeo ginecológico? (Si aplica)',
    options: ['Hace menos de 1 año', 'Hace 1-2 años', 'Hace más de 2 años', 'Nunca me he hecho una']
  },
];

export default function AssessmentScreen({ navigation }) {
  // Estado para guardar las respuestas. Ej: {q1: 'Sí, regularmente', q2: 'No' }
  const [answers, setAnswers] = useState({});

  const handleSelectAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    // Logic to analyze answers
    let riskLevel = 'low';
    let recommendation = '';

    // Check for high risk answers
    if (answers['q2'] === 'Sí' || answers['q3'] === 'Sí') {
      riskLevel = 'high';
    } else if (answers['q1'] === 'No, nunca' || answers['q4'] === 'Hace más de 2 años') {
      riskLevel = 'medium';
    }

    if (riskLevel === 'high') {
      recommendation = "Basado en tus respuestas, recomendamos agendar una cita INMEDIATAMENTE. Por favor consulta con un especialista lo antes posible.";
    } else if (riskLevel === 'medium') {
      recommendation = "Deberías planear agendar una cita en el FUTURO CERCANO. Es importante mantenerte al tanto de tu salud.";
    } else {
      recommendation = "¡Parece que estás bien! Continúa con tus chequeos regulares y autoexámenes.";
    }

    Alert.alert(
      "Resultado de la Evaluación",
      recommendation,
      [
        { text: "Agendar Cita", onPress: () => navigation.navigate('Citas') },
        { text: "OK" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <ScrollView style={styles.pageContainer} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Auto-Evaluación</Text>

        {/* --- Imagen Real --- */}
        <Image
          source={require('../assets/guia_autoexamen.jpeg')}
          style={styles.assessmentImage}
        />

        {questions.map((q) => (
          <View key={q.id} style={styles.assessmentCard}>
            <Text style={styles.assessmentQuestion}>{q.text}</Text>
            <View style={styles.optionsContainer}>
              {q.options.map((option) => {
                const isSelected = answers[q.id] === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.assessmentButton,
                      isSelected && styles.assessmentButtonActive
                    ]}
                    onPress={() => handleSelectAnswer(q.id, option)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={[
                      styles.assessmentButtonText,
                      isSelected && styles.assessmentButtonTextActive
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Evaluación</Text>
          <Ionicons name="arrow-forward-circle-outline" size={24} color={COLORS.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

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
  pageContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  assessmentImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assessmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  assessmentQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  assessmentButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentButtonActive: {
    backgroundColor: COLORS.brandLight,
    borderColor: COLORS.brandPink,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: COLORS.brandPink,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brandPink,
  },
  assessmentButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  assessmentButtonTextActive: {
    color: COLORS.brandDeep,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandPink,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 40,
    shadowColor: COLORS.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});