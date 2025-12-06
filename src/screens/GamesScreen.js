import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated, StatusBar, Platform } from 'react-native';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Datos del juego
const gameData = [
  {
    question: 'MITO O REALIDAD: Si no tengo antecedentes familiares, no estoy en riesgo de cáncer de mama.',
    answer: 'MITO',
    explanation: 'REALIDAD: La mayoría de las mujeres diagnosticadas con cáncer de mama no tienen antecedentes familiares. Todas las mujeres están en riesgo.'
  },
  {
    question: 'MITO O REALIDAD: Encontrar un bulto en el pecho significa que tengo cáncer.',
    answer: 'MITO',
    explanation: 'REALIDAD: La mayoría de los bultos (más del 80%) no son cancerosos. Sin embargo, cualquier bulto nuevo debe ser revisado por un médico.'
  },
  {
    question: 'MITO O REALIDAD: La mamografía es la única forma de detectar el cáncer de mama.',
    answer: 'MITO',
    explanation: 'REALIDAD: El autoexamen mensual y el examen clínico por un profesional también son claves. La mamografía es una herramienta de detección crucial, pero no la única.'
  },
  {
    question: 'MITO O REALIDAD: El uso de desodorantes antitranspirantes causa cáncer de mama.',
    answer: 'MITO',
    explanation: 'REALIDAD: No existe evidencia científica concluyente que vincule el uso de desodorantes o antitranspirantes con el cáncer de mama.'
  },
  {
    question: 'MITO O REALIDAD: El cáncer de mama solo afecta a mujeres mayores.',
    answer: 'MITO',
    explanation: 'REALIDAD: Aunque el riesgo aumenta con la edad, el cáncer de mama puede afectar a mujeres jóvenes también.'
  },
  {
    question: 'MITO O REALIDAD: Los hombres también pueden tener cáncer de mama.',
    answer: 'REALIDAD',
    explanation: 'REALIDAD: Sí, aunque es raro (menos del 1% de todos los casos), los hombres pueden desarrollar cáncer de mama.'
  }
];

function BreathingGame() {
  const [scale] = useState(new Animated.Value(1));
  const [text, setText] = useState('Inhala...');

  useEffect(() => {
    const breathe = () => {
      setText('Inhala...');
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        setText('Exhala...');
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => breathe());
      });
    };
    breathe();
  }, []);

  return (
    <View style={styles.breathingContainer}>
      <Text style={styles.breathingTitle}>Relájate y Respira</Text>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Text style={styles.circleText}>{text}</Text>
      </Animated.View>
      <Text style={styles.breathingSubtitle}>Tómate un momento para ti.</Text>
    </View>
  );
}

export default function GamesScreen() {
  const [activeTab, setActiveTab] = useState('myths'); // 'myths' or 'breathing'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct: boolean, text: string }

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = gameData[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
      setFeedback({ correct: true, text: currentQuestion.explanation });
    } else {
      setFeedback({ correct: false, text: currentQuestion.explanation });
    }

    setTimeout(() => {
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < gameData.length) {
        setCurrentQuestionIndex(nextQuestion);
        setFeedback(null);
      } else {
        setShowResult(true);
      }
    }, 4000); // Espera 4 segundos para mostrar la explicación
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienestar y Aprendizaje</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'myths' && styles.tabButtonActive]}
          onPress={() => setActiveTab('myths')}
        >
          <Ionicons name="bulb-outline" size={20} color={activeTab === 'myths' ? COLORS.white : COLORS.brandDeep} style={{ marginRight: 8 }} />
          <Text style={[styles.tabText, activeTab === 'myths' && styles.tabTextActive]}>Mitos y Realidades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'breathing' && styles.tabButtonActive]}
          onPress={() => setActiveTab('breathing')}
        >
          <Ionicons name="leaf-outline" size={20} color={activeTab === 'breathing' ? COLORS.white : COLORS.brandDeep} style={{ marginRight: 8 }} />
          <Text style={[styles.tabText, activeTab === 'breathing' && styles.tabTextActive]}>Respiración</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'breathing' ? (
        <BreathingGame />
      ) : (
        <ScrollView style={styles.pageContainer} contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {showResult ? (
            <View style={styles.gameContainer}>
              <Ionicons name="trophy" size={80} color={COLORS.brandPink} style={{ marginBottom: 20 }} />
              <Text style={styles.pageTitle}>¡Juego Terminado!</Text>
              <Text style={styles.resultText}>
                Tu puntuación: <Text style={{ color: COLORS.brandDeep }}>{score}</Text> de {gameData.length}
              </Text>
              <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Text style={styles.restartButtonText}>Jugar de Nuevo</Text>
                <Ionicons name="refresh" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Pregunta {currentQuestionIndex + 1} de {gameData.length}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / gameData.length) * 100}%` }]} />
                </View>
              </View>

              <View style={styles.questionCard}>
                <Text style={styles.questionText}>
                  {gameData[currentQuestionIndex].question}
                </Text>
              </View>

              {feedback ? (
                <View style={[
                  styles.feedbackCard,
                  { backgroundColor: feedback.correct ? '#E8F5E9' : '#FFEBEE', borderColor: feedback.correct ? COLORS.success : COLORS.error }
                ]}>
                  <View style={styles.feedbackHeader}>
                    <Ionicons name={feedback.correct ? "checkmark-circle" : "close-circle"} size={24} color={feedback.correct ? COLORS.success : COLORS.error} />
                    <Text style={[styles.feedbackTitle, { color: feedback.correct ? COLORS.success : COLORS.error }]}>
                      {feedback.correct ? '¡CORRECTO!' : 'INCORRECTO'}
                    </Text>
                  </View>
                  <Text style={styles.feedbackText}>{feedback.text}</Text>
                </View>
              ) : (
                <View style={styles.answerButtons}>
                  <TouchableOpacity
                    style={[styles.gameButton, styles.mythButton]}
                    onPress={() => handleAnswer('MITO')}
                  >
                    <Text style={styles.gameButtonText}>MITO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.gameButton, styles.realityButton]}
                    onPress={() => handleAnswer('REALIDAD')}
                  >
                    <Text style={styles.gameButtonText}>REALIDAD</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.brandPink,
    backgroundColor: COLORS.white,
  },
  tabButtonActive: {
    backgroundColor: COLORS.brandPink,
  },
  tabText: {
    color: COLORS.brandDeep,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 16,
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressText: {
    color: COLORS.gray,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.brandPink,
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  gameButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  mythButton: {
    backgroundColor: COLORS.brandDeep,
  },
  realityButton: {
    backgroundColor: COLORS.brandPink,
  },
  gameButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  resultText: {
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  restartButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandPink,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  restartButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackCard: {
    marginTop: 20,
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 60,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.brandPink,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.brandPink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  circleText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  breathingSubtitle: {
    marginTop: 60,
    fontSize: 18,
    color: COLORS.text,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});