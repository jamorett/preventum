import React, { createContext, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const AppointmentsContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const addAppointment = (appointment) => {
    // Añade un ID único a la nueva cita
    const newAppointment = { ...appointment, id: uuidv4() };
    setAppointments([...appointments, newAppointment]);
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};