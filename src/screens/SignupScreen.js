import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import COLORS from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'doctor'
    const [proofUploaded, setProofUploaded] = useState(false);
    const { signup } = useContext(AuthContext);

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        if (role === 'doctor' && !proofUploaded) {
            Alert.alert('Error', 'Los doctores deben subir un comprobante de certificación');
            return;
        }

        try {
            await signup(email, password, role);
            // Navigation will be handled by AppNavigator based on auth state
        } catch (error) {
            Alert.alert('Error de Registro', error.message);
        }
    };

    const handleUploadProof = () => {
        // Mock upload
        Alert.alert('Subida Exitosa', 'Comprobante subido correctamente (Simulado)');
        setProofUploaded(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Únete a la comunidad Preventum</Text>
                    </View>

                    <View style={styles.formContainer}>

                        {/* Selector de Rol */}
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'user' && styles.roleButtonActive]}
                                onPress={() => setRole('user')}
                            >
                                <Ionicons name="person-outline" size={20} color={role === 'user' ? COLORS.white : COLORS.brandDeep} style={{ marginRight: 8 }} />
                                <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Usuario</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'doctor' && styles.roleButtonActive]}
                                onPress={() => setRole('doctor')}
                            >
                                <Ionicons name="medkit-outline" size={20} color={role === 'doctor' ? COLORS.white : COLORS.brandDeep} style={{ marginRight: 8 }} />
                                <Text style={[styles.roleText, role === 'doctor' && styles.roleTextActive]}>Doctor</Text>
                            </TouchableOpacity>
                        </View>

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

                        {role === 'doctor' && (
                            <TouchableOpacity style={[styles.uploadButton, proofUploaded && styles.uploadButtonSuccess]} onPress={handleUploadProof}>
                                <Ionicons name={proofUploaded ? "checkmark-circle" : "cloud-upload-outline"} size={24} color={proofUploaded ? COLORS.white : COLORS.brandDeep} />
                                <Text style={[styles.uploadButtonText, proofUploaded && styles.uploadButtonTextSuccess]}>
                                    {proofUploaded ? 'Certificación Subida' : 'Subir Certificación Médica'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                            <Text style={styles.footerText}>¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia Sesión</Text></Text>
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
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.brandDeep,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        opacity: 0.7,
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: COLORS.brandDeep,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
    roleContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: COLORS.brandLight,
        borderRadius: 16,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    roleButtonActive: {
        backgroundColor: COLORS.brandPink,
        shadowColor: COLORS.brandPink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    roleText: {
        color: COLORS.brandDeep,
        fontWeight: '600',
        fontSize: 15,
    },
    roleTextActive: {
        color: COLORS.white,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
    },
    uploadButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.brandLight,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.brandPink,
        borderStyle: 'dashed',
    },
    uploadButtonSuccess: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
        borderStyle: 'solid',
    },
    uploadButtonText: {
        color: COLORS.brandDeep,
        fontWeight: '600',
        marginLeft: 10,
    },
    uploadButtonTextSuccess: {
        color: COLORS.white,
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
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.text,
        fontSize: 15,
    },
    linkText: {
        color: COLORS.brandDeep,
        fontWeight: 'bold',
    },
});
