import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/Colors';
import { sendMessageToGroq } from '../services/GroqService';

const SYSTEM_PROMPT = {
    role: 'system',
    content: `Eres "Preventum AI", un asistente virtual amigable y experto de la aplicación móvil "Preventum". 
    Preventum es una app dedicada a la salud preventiva, especialmente enfocada en la detección temprana y prevención del cáncer.
    
    Tus objetivos son:
    1. Responder preguntas sobre salud general y prevención de forma educativa y empática.
    2. Guiar a los usuarios sobre las funcionalidades de la app (citas, juegos cognitivos, evaluaciones, mapa de centros).
    3. SIEMPRE aclarar que NO eres un médico y que tus consejos no reemplazan una consulta profesional.
    4. Ser breve, conciso y usar un tono positivo y motivador.
    
    Si te preguntan algo fuera de tu conocimiento médico/app, responde educadamente que tu función es asistir en temas de salud y la app Preventum.`
};

export default function ChatbotScreen({ navigation }) {
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', content: '¡Hola! Soy Preventum AI. 🤖\n¿En qué puedo ayudarte hoy con tu salud o sobre la app?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = async () => {
        if (inputText.trim() === '') return;

        const userMessage = { role: 'user', content: inputText.trim() };
        const newMessages = [...messages, { ...userMessage, id: Date.now().toString() }];

        setMessages(newMessages);
        setInputText('');
        setIsLoading(true);

        try {
            // Filter out ids for API call and include system prompt
            const apiMessages = [
                SYSTEM_PROMPT,
                ...newMessages.map(m => ({ role: m.role, content: m.content }))
            ];

            const responseContent = await sendMessageToGroq(apiMessages);

            setMessages(prev => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: responseContent }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Lo siento, tuve un problema al conectar. Por favor intenta de nuevo.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.role === 'user';
        return (
            <View style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.botText
                ]}>
                    {item.content}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Asistente Preventum</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.brandActive} />
                    <Text style={styles.loadingText}>Escribiendo...</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Escribe tu mensaje..."
                    placeholderTextColor="#999"
                    multiline
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={isLoading}>
                    <Ionicons name="send" size={24} color="#FFF" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.brandActive || '#4A90E2', // Fallback if COLORS not loaded
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'android' ? 40 : 12, // Status bar safe area fix
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 80,
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.brandActive || '#4A90E2',
        borderBottomRightRadius: 2,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#FFF',
    },
    botText: {
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: COLORS.brandActive || '#4A90E2',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginBottom: 10,
    },
    loadingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 12,
        fontStyle: 'italic',
    },
});
