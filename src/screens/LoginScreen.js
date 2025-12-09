import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Para iconos

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Error de Inicio de Sesión', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Header / Logo */}
                    <View style={styles.header}>
                        <Image
                            source={require('../assets/preventumlogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>PREVENTUM</Text>
                        <Text style={styles.slogan}>CUIDADO. RECUERDO. APOYO.</Text>
                    </View>

                    {/* Formulario */}
                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>Bienvenido de nuevo</Text>
                        <Text style={styles.subText}>Ingresa a tu cuenta para continuar</Text>


                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.brandDeep} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Electrónico"
                                placeholderTextColor={COLORS.gray}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.brandDeep} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.linkText}>Regístrate</Text>
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
        backgroundColor: COLORS.brandLight,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
        // tintColor removed to show original logo colors
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
        letterSpacing: 2,
    },
    slogan: {
        fontSize: 14,
        color: COLORS.text,
        marginTop: 8,
        letterSpacing: 1,
        fontWeight: '500',
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: COLORS.brandDeep,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subText: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'transparent', // Para evitar saltos visuales al enfocar si se quisiera animar
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.brandPink,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COLORS.brandPink,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: COLORS.text,
        fontSize: 14,
    },
    linkText: {
        color: COLORS.brandDeep,
        fontSize: 14,
        fontWeight: 'bold',
    },
});