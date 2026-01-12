import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  Platform,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  Dimensions
} from 'react-native';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// --- DATOS DE EJEMPLO DE DOCTORES (Hardcoded para demostración) ---
const DOCTORS_DATA = [
  {
    id: '1',
    name: 'Dr. Pedro Ramírez',
    specialty: 'Oncólogo Clínico',
    linkedinUrl: 'https://www.linkedin.com/in/pedro-ramirez-onco', // URL Real o de ejemplo
    // Usamos una imagen de placeholder para el título
    titleImage: 'https://placehold.co/400x600/png?text=Titulo+Dr.+Pedro', 
  },
  {
    id: '2',
    name: 'Dra. María Velez',
    specialty: 'Mastóloga / Cirujana',
    linkedinUrl: 'https://www.linkedin.com',
    titleImage: 'https://placehold.co/400x600/png?text=Certificado+Dra.+Maria',
  },
  {
    id: '3',
    name: 'Dr. Juan Carlos Loor',
    specialty: 'Psico-Oncólogo',
    linkedinUrl: 'https://www.linkedin.com',
    titleImage: 'https://placehold.co/400x600/png?text=Titulo+Dr.+Juan',
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los Modales
  const [doctorsModalVisible, setDoctorsModalVisible] = useState(false);
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [selectedTitleImage, setSelectedTitleImage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para abrir LinkedIn
  const handleOpenLinkedIn = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("No se pudo abrir el enlace: " + url);
      }
    });
  };

  // Función para ver el título
  const handleViewTitle = (imageUrl) => {
    setSelectedTitleImage(imageUrl);
    setTitleModalVisible(true);
  };

  // Renderizado de cada Post (Feed normal)
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.authorName ? item.authorName.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName} numberOfLines={1} ellipsizeMode="tail">
              {item.authorName || 'Usuario'}
            </Text>
            <Text style={styles.postDate}>
              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Reciente'}
            </Text>
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.gray} />
      </View>
      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postFooter}>
        <View style={styles.interactionButton}>
          <Ionicons name="heart-outline" size={22} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Me gusta</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Comentar</Text>
        </View>
        <View style={styles.interactionButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.brandDeep} />
          <Text style={styles.interactionText}>Compartir</Text>
        </View>
      </View>
    </View>
  );

  // Renderizado de cada Doctor en la lista del Modal
  const renderDoctorItem = ({ item }) => (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
      </View>
      
      <View style={styles.doctorActions}>
        {/* Botón Ver Título */}
        <TouchableOpacity 
          style={styles.titleButton} 
          onPress={() => handleViewTitle(item.titleImage)}
        >
          <Ionicons name="ribbon-outline" size={20} color={COLORS.brandPink} />
          <Text style={styles.titleButtonText}>Título</Text>
        </TouchableOpacity>

        {/* Botón LinkedIn */}
        <TouchableOpacity 
          style={styles.linkedinActionButton}
          onPress={() => handleOpenLinkedIn(item.linkedinUrl)}
        >
          <Ionicons name="logo-linkedin" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brandPink} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      
      {/* HEADER CON BOTÓN DE LINKEDIN */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Comunidad</Text>
          <Text style={styles.headerSubtitle}>Comparte y apoya</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.linkedinHeaderButton}
          onPress={() => setDoctorsModalVisible(true)}
        >
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
          <Text style={styles.linkedinHeaderText}>Doctores</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={48} color={COLORS.brandInactive} />
            <Text style={styles.emptyText}>No hay publicaciones aún.</Text>
            <Text style={styles.emptySubText}>¡Sé el primero en compartir algo!</Text>
          </View>
        }
      />

      {/* --- MODAL 1: LISTA DE DOCTORES --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={doctorsModalVisible}
        onRequestClose={() => setDoctorsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuestros Especialistas</Text>
              <TouchableOpacity onPress={() => setDoctorsModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Verifica sus credenciales y conéctalos.</Text>

            <FlatList
              data={DOCTORS_DATA}
              renderItem={renderDoctorItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: VISOR DE TÍTULO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={titleModalVisible}
        onRequestClose={() => setTitleModalVisible(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.closeImageButton} 
            onPress={() => setTitleModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>

          <View style={styles.titleImageContainer}>
            {selectedTitleImage && (
              <Image 
                source={{ uri: selectedTitleImage }} 
                style={styles.titleImageFull}
                resizeMode="contain"
              />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brandLight,
  },
  
  // --- HEADER MODIFICADO ---
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  linkedinHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  linkedinHeaderText: {
    marginLeft: 6,
    color: '#0077B5', // Azul LinkedIn
    fontWeight: 'bold',
    fontSize: 14
  },

  listContent: {
    padding: 20,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.brandPink,
  },
  avatarText: {
    color: COLORS.brandDeep,
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
  },
  postDate: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 8,
  },

  // --- ESTILOS MODAL DOCTORES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  doctorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: COLORS.brandPink,
    fontWeight: '600'
  },
  doctorActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    padding: 6,
    backgroundColor: COLORS.brandLight,
    borderRadius: 8,
  },
  titleButtonText: {
    fontSize: 10,
    color: COLORS.brandPink,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  linkedinActionButton: {
    backgroundColor: '#0077B5',
    padding: 8,
    borderRadius: 8,
  },

  // --- ESTILOS MODAL IMAGEN (TITULO) ---
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  titleImageContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleImageFull: {
    width: '100%',
    height: '100%',
  },
});