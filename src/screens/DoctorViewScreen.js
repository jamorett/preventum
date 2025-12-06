import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, StatusBar } from 'react-native';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorViewScreen({ navigation }) {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handlePublish = () => {
    if (!postTitle || !postContent) {
      Alert.alert("Error", "Por favor completa el título y el contenido.");
      return;
    }

    // Simulación de envío
    console.log("Nuevo Post:", { title: postTitle, content: postContent });

    Alert.alert(
      "Publicación Exitosa",
      "Tu artículo ha sido publicado. (En una app real, esto aparecería en el Feed de los usuarios)."
    );

    // Limpiar campos
    setPostTitle('');
    setPostContent('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
      <ScrollView style={styles.pageContainer} contentContainerStyle={{ paddingBottom: 24 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.brandDeep} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Simulación Doctor</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="flask-outline" size={24} color={COLORS.brandDeep} style={{ marginRight: 12 }} />
          <Text style={styles.infoText}>
            Esta es una vista simulada para que los usuarios vean cómo sería la interfaz de un doctor.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear Artículo</Text>
          <Text style={styles.subtitle}>
            Escribe un artículo, consejo o noticia para que aparezca en el Feed de los usuarios.
          </Text>

          <Text style={styles.label}>Título del Artículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Nuevos avances en mamografía"
            placeholderTextColor={COLORS.gray}
            value={postTitle}
            onChangeText={setPostTitle}
          />

          <Text style={styles.label}>Contenido del Artículo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe el contenido aquí..."
            placeholderTextColor={COLORS.gray}
            value={postContent}
            onChangeText={setPostContent}
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>Publicar (Simulación)</Text>
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E1F5FE',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  infoText: {
    color: '#0277BD',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brandDeep,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.brandLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 150,
  },
  publishButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandDeep,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.brandDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  publishButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});