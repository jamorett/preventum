import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePostScreen({ navigation }) {
    const { user, userData } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!content.trim()) {
            Alert.alert('Publicación vacía', 'Por favor escribe algo para publicar.');
            return;
        }

        setLoading(true);
        try {
            const authorName = userData?.role === 'doctor'
                ? `Dr. ${user.displayName || 'Usuario'}`
                : (user.displayName || 'Usuario');

            await addDoc(collection(db, 'posts'), {
                userId: user.uid,
                authorName: authorName,
                content: content.trim(),
                createdAt: serverTimestamp(),
                likes: 0,
                comments: 0,
            });

            Alert.alert('Éxito', 'Tu publicación ha sido creada.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Error creating post:", error);
            Alert.alert('Error', 'No se pudo crear la publicación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.brandLight} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="close" size={28} color={COLORS.brandDeep} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Crear Publicación</Text>
                        <TouchableOpacity
                            style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}
                            onPress={handlePost}
                            disabled={loading || !content.trim()}
                        >
                            <Text style={styles.postButtonText}>{loading ? '...' : 'Publicar'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: user?.photoURL || 'https://via.placeholder.com/50' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.userName}>{user?.displayName || 'Doctor'}</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="¿Qué quieres compartir con la comunidad?"
                        placeholderTextColor={COLORS.gray}
                        multiline
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                    />

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Info', 'La función de subir fotos está deshabilitada temporalmente.')}>
                            <Ionicons name="image-outline" size={24} color={COLORS.gray} />
                            <Text style={[styles.actionText, { color: COLORS.gray }]}>Foto/Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="happy-outline" size={24} color={COLORS.brandPink} />
                            <Text style={styles.actionText}>Sentimiento</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
    },
    postButton: {
        backgroundColor: COLORS.brandPink,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        backgroundColor: COLORS.lightGray,
    },
    postButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    input: {
        fontSize: 18,
        color: COLORS.text,
        padding: 16,
        minHeight: 150,
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        marginTop: 'auto',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 8,
        color: COLORS.brandPink,
        fontWeight: '600',
    },
});
