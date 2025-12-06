import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { AppointmentsProvider } from './src/context/AppointmentsContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import COLORS from './src/constants/Colors';

// Tema de Navegación Personalizado
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.brandLight, // Fondo global
  },
};

// Componente principal que decide qué navegador mostrar
function AppContent() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.brandLight }}>
        <ActivityIndicator size="large" color={COLORS.brandPink} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
      {/* <AppNavigator /> */}
    </NavigationContainer>
  );
}

// Envolvemos todo en los Proveedores de Contexto
export default function App() {
  return (
    <AuthProvider>
      <AppointmentsProvider>
        <StatusBar style="dark" backgroundColor={COLORS.brandLight} />
        <AppContent />
      </AppointmentsProvider>
    </AuthProvider>
  );
}