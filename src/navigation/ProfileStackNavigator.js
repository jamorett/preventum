import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import NearbyCentersScreen from '../screens/NearbyCentersScreen';
import DoctorViewScreen from '../screens/DoctorViewScreen';
import COLORS from '../constants/Colors';

const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.brandLight,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="NearbyCenters"
        component={NearbyCentersScreen}
        options={{ title: 'Centros Cercanos' }}
      />
      <Stack.Screen
        name="DoctorView"
        component={DoctorViewScreen}
        options={{ title: 'Vista de Doctor' }}
      />
    </Stack.Navigator>
  );
}