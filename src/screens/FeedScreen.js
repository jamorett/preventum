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
  Dimensions,
  Share,
  TextInput
} from 'react-native';
import { db, auth } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, addDoc, getDoc } from 'firebase/firestore';
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

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los Modales
  const [doctorsModalVisible, setDoctorsModalVisible] = useState(false);
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [selectedTitleImage, setSelectedTitleImage] = useState(null);

  // Estados para Comentarios
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const currentUser = auth.currentUser;

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

  // --- SOCIAL FUNCTIONS ---

  const handleLike = async (post) => {
    if (!currentUser) return;

    const postRef = doc(db, 'posts', post.id);
    const isLiked = post.likes && post.likes.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleOpenComments = (post) => {
    setSelectedPostId(post.id);
    setCommentsModalVisible(true);
    setLoadingComments(true);

    const commentsRef = collection(db, 'posts', post.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    // Real-time listener for comments of a specific post
    // Note: We need to store unsubscribe function if we want to clean it up properly,
    // but for simplicity in this modal flow we'll just listen.
    // Ideally, use a useEffect inside a separate CommentList component.
    // Here we'll just fetch once or set up a listener that we might not easily clean up without refactoring.
    // Better approach: Use a useEffect dependent on selectedPostId.
  };

  // Efecto para cargar comentarios cuando cambia el post seleccionado
  useEffect(() => {
    if (!selectedPostId || !commentsModalVisible) return;

    const commentsRef = collection(db, 'posts', selectedPostId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc')); // Oldest first usually better for comments but simplest is newest top

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [selectedPostId, commentsModalVisible]);


  const handleSendComment = async () => {
    if (newComment.trim() === '' || !selectedPostId || !currentUser) return;

    try {
      let authorName = currentUser.displayName;

      // If displayName is missing, try to fetch it from Firestore 'users' collection
      if (!authorName) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Try 'name', 'firstName', 'fullName', or fallbacks
            authorName = userData.name || userData.fullName || userData.firstName || 'Usuario';
          }
        } catch (fetchError) {
          console.error("Error fetching user details for comment:", fetchError);
        }
      }

      await addDoc(collection(db, 'posts', selectedPostId, 'comments'), {
        text: newComment.trim(),
        authorId: currentUser.uid,
        authorName: authorName || 'Usuario',
        createdAt: new Date(), // Firestore serverTimestamp is better but this works for now
      });

      // Update comment count on post (optional but good for UX)
      /* await updateDoc(doc(db, 'posts', selectedPostId), {
         commentsCount: increment(1)
      }); */

      setNewComment('');
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const handleShare = async (post) => {
    try {
      const result = await Share.share({
        message: `Mira esta publicación en Preventum: ${post.content}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Renderizado de cada Post (Feed normal)
  const renderPost = ({ item }) => {
    const isLiked = item.likes && currentUser && item.likes.includes(currentUser.uid);
    const likesCount = item.likes ? item.likes.length : 0;

    return (
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
          <TouchableOpacity style={styles.interactionButton} onPress={() => handleLike(item)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? COLORS.brandPink : COLORS.brandDeep}
            />
            <Text style={[styles.interactionText, isLiked && { color: COLORS.brandPink }]}>
              {likesCount > 0 ? likesCount : 'Me gusta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton} onPress={() => handleOpenComments(item)}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.brandDeep} />
            <Text style={styles.interactionText}>Comentar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionButton} onPress={() => handleShare(item)}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.brandDeep} />
            <Text style={styles.interactionText}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  // Renderizado de comentarios
  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>{item.authorName ? item.authorName.charAt(0).toUpperCase() : 'U'}</Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.authorName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
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

      {/* --- MODAL 3: COMENTARIOS --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentsModalVisible}
        onRequestClose={() => setCommentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentComments}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity onPress={() => setCommentsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {loadingComments ? (
              <ActivityIndicator size="small" color={COLORS.brandPink} style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id}
                style={styles.commentsList}
                ListEmptyComponent={
                  <Text style={styles.noCommentsText}>Aún no hay comentarios. ¡Sé el primero!</Text>
                }
              />
            )}

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity onPress={handleSendComment} style={styles.sendCommentButton}>
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- FAB CHATBOT --- */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Ionicons name="chatbubbles" size={28} color="white" />
      </TouchableOpacity>
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
    width: '100%',
    height: '100%',
  },

  // --- ESTILOS FAB CHATBOT ---
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    backgroundColor: COLORS.brandActive || '#4A90E2',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },

  // --- ESTILOS MODAL COMENTARIOS ---
  modalContentComments: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  commentsList: {
    flex: 1,
    marginTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: COLORS.brandDeep,
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 15,
  },
  sendCommentButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brandActive || '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});