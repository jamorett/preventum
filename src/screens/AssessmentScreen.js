import React, { useState } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  StatusBar, 
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// PREGUNTAS
const questions = [
  {
    id: 'q1',
    category: 'Visual',
    text: 'Paso 1: Frente al espejo. ¿Notas cambios en la piel o en la forma de los senos?',
    options: ['No, todo se ve normal', 'Sí, noto un cambio visual', 'No estoy segura']
  },
  {
    id: 'q2',
    category: 'Palpacion',
    text: 'Paso 2: Al palpar en círculos. ¿Sientes algún bulto, bolita endurecida o zona muy distinta al resto?',
    options: ['No, no siento nada extraño', 'Sí, siento algo', 'Siento dolor general']
  },
  {
    id: 'q3',
    category: 'Secrecion',
    text: 'Paso 3: Al presionar suavemente el pezón. ¿Notas salida de fluidos?',
    options: ['No', 'Sí, hay secreción']
  },
  {
    id: 'q4',
    category: 'Frecuencia',
    text: '¿Es este tu chequeo habitual del mes?',
    options: ['Sí, cumplo mi rutina', 'No, hace mucho no lo hacía', 'Es mi primera vez']
  },
];

export default function AssessmentScreen({ navigation }) {
  const [answers, setAnswers] = useState({});
  
  // Estado para el Modal de Resultados
  const [modalVisible, setModalVisible] = useState(false);
  const [resultData, setResultData] = useState({ title: '', message: '', icon: '', color: '', actionLabel: '' });

  // NUEVO: Estado para el Zoom de la Imagen
  const [imageZoomVisible, setImageZoomVisible] = useState(false);

  const handleSelectAnswer = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    if (!answers['q1'] || !answers['q2'] || !answers['q3']) {
      setResultData({
        title: "Falta poco",
        message: "Por favor completa los 3 pasos para terminar tu registro de hoy.",
        icon: "alert-circle-outline",
        color: COLORS.gray,
        actionLabel: "Continuar"
      });
      setModalVisible(true);
      return;
    }

    let riskCategory = 'good'; 

    if (answers['q1'] === 'Sí, noto un cambio visual' || 
        answers['q2'] === 'Sí, siento algo' || 
        answers['q3'] === 'Sí, hay secreción') {
      riskCategory = 'attention';
    } else if (answers['q1'] === 'No estoy segura' || answers['q4'] === 'Es mi primera vez') {
      riskCategory = 'education';
    } else if (answers['q4'] === 'No, hace mucho no lo hacía') {
      riskCategory = 'reminder';
    }

    let data = {};

    switch (riskCategory) {
      case 'attention':
        data = {
          title: "Estemos atentas",
          message: "Has notado algo diferente hoy. ¡No te alarmes! El cuerpo tiene cambios naturales por hormonas o estrés. Lo importante es el monitoreo: \n\n1. Revisa si persiste en unos días. \n2. Mantente atenta a otros síntomas. \n3. Si tienes dudas, una visita preventiva al médico te dará tranquilidad.",
          icon: "eye-outline",
          color: "#FFB74D",
          actionLabel: "Entendido, estaré pendiente"
        };
        break;
      case 'education':
        data = {
          title: "Aprendiendo juntas",
          message: "Conocer tu cuerpo toma tiempo. Es normal tener dudas al principio sobre qué es 'normal' y qué no. La constancia te hará experta en tu propia salud.",
          icon: "book-outline",
          color: "#5DADE2",
          actionLabel: "Gracias"
        };
        break;
      case 'reminder':
        data = {
          title: "Buen regreso",
          message: "¡Qué bueno que retomaste el hábito! Intentar hacerlo siempre unos días después de tu periodo ayuda a que los resultados sean más precisos.",
          icon: "calendar-outline",
          color: "#AF7AC5",
          actionLabel: "Listo"
        };
        break;
      default:
        data = {
          title: "Todo en orden",
          message: "¡Excelente! No encontraste anomalías hoy. Sigue así, la prevención es un acto de amor propio. Nos vemos el próximo mes.",
          icon: "heart-circle-outline",
          color: "#58D68D",
          actionLabel: "Finalizar"
        };
    }

    setResultData(data);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <ScrollView style={styles.pageContainer} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Guía de Autoexamen</Text>
        <Text style={styles.pageSubtitle}>Tómate un momento para ti y sigue los pasos.</Text>

        {/* --- IMAGEN CON ZOOM --- */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => setImageZoomVisible(true)}
          style={styles.imageContainer}
        >
          <Image
            source={require('../assets/guia_autoexamen.jpeg')}
            style={styles.assessmentImage}
          />
          {/* Indicador de Zoom */}
          <View style={styles.zoomIndicator}>
            <Ionicons name="expand-outline" size={16} color="white" />
            <Text style={styles.zoomText}>Toca para ampliar</Text>
          </View>
        </TouchableOpacity>

        {questions.map((q) => (
          <View key={q.id} style={styles.assessmentCard}>
            <Text style={styles.categoryLabel}>{q.category.toUpperCase()}</Text>
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
          <Text style={styles.submitButtonText}>Registrar Resultado</Text>
          <Ionicons name="checkmark-done-circle-outline" size={24} color={COLORS.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

      </ScrollView>

      {/* --- MODAL 1: ZOOM DE IMAGEN --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={imageZoomVisible}
        onRequestClose={() => setImageZoomVisible(false)}
      >
        <View style={styles.zoomModalOverlay}>
          {/* Botón cerrar arriba a la derecha */}
          <TouchableOpacity 
            style={styles.zoomCloseButton} 
            onPress={() => setImageZoomVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>

          <View style={styles.zoomedImageContainer}>
             <Image
              source={require('../assets/guia_autoexamen.jpeg')}
              style={styles.zoomedImage}
            />
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: RESULTADOS (Assessment) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={[styles.iconContainer, { backgroundColor: resultData.color }]}>
               <Ionicons name={resultData.icon} size={36} color="white" />
            </View>

            <Text style={styles.modalTitle}>{resultData.title}</Text>
            
            <Text style={styles.modalMessage}>
              {resultData.message}
            </Text>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: resultData.color }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{resultData.actionLabel}</Text>
            </TouchableOpacity>

            {resultData.title === "Estemos atentas" && (
                <TouchableOpacity 
                  style={styles.modalSecondaryButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('NearbyCenters');
                  }}
                >
                  <Text style={styles.modalSecondaryText}>Ver centros médicos cercanos</Text>
                </TouchableOpacity>
            )}

            {resultData.title !== "Estemos atentas" && (
                <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
                >
                <Text style={styles.modalCloseText}>Cerrar</Text>
                </TouchableOpacity>
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
  pageContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginTop: 20,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // IMAGEN THUMBNAIL (Con indicador)
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    position: 'relative', // Necesario para el indicador
  },
  assessmentImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600'
  },

  // ESTILOS MODAL ZOOM
  zoomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Fondo oscuro casi total
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImageContainer: {
    width: '95%',
    height: '80%',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Importante para que no se corte
  },
  zoomCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10, // Para que esté encima de la imagen si se solapan
  },

  // RESTO DE ESTILOS (Cuestionario)
  assessmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.brandPink,
    marginBottom: 8,
    letterSpacing: 1,
  },
  assessmentQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  assessmentButton: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentButtonActive: {
    backgroundColor: '#FFF0F5',
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
    fontSize: 14,
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
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
  },
  // ESTILOS MODAL RESULTADOS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -50, 
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSecondaryButton: {
    marginTop: 8,
    paddingVertical: 10,
  },
  modalSecondaryText: {
    color: COLORS.gray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalCloseButton: {
    paddingVertical: 10,
  },
  modalCloseText: {
    color: COLORS.gray,
    fontSize: 15,
    fontWeight: '600'
  }
});