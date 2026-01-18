# Preventum

Preventum is a comprehensive mobile application designed to bridge the gap between patients and healthcare providers. Built with React Native and Expo, it facilitates appointment management, doctor-patient interaction, and provides AI-powered assistance.

## Features

- **User Roles:** Distinct dashboards for Doctors and Patients.
- **Authentication:** Secure login and signup using Firebase Auth and Google Sign-In.
- **Appointments:** Easy scheduling and management of medical appointments.
- **Geolocation:** Find nearby cancer centers and medical facilities using Google Maps.
- **AI Assistant:** Integrated chatbot/assistant powered by Groq for health-related queries.
- **Profile Management:** Comprehensive user and doctor profiles.

## Tech Stack

- **Frontend:** React Native, Expo
- **Backend/Services:** Firebase (Authentication, Firestore), Groq AI
- **Navigation:** React Navigation (Stack, Bottom Tabs)
- **Maps:** React Native Maps
- **State/Storage:** Async Storage

## Prerequisites

- Node.js
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or a physical device with Expo Go)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd miApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

Start the development server:

```bash
npm start
# or
npx expo start
```

- Press `a` to open in Android Emulator.
- Press `i` to open in iOS Simulator.
- Scan the QR code with Expo Go on your physical device.

## Configuration

Ensure you have the necessary API keys configured for:
- Firebase (`google-services.json` / `GoogleService-Info.plist`)
- Google Maps API Key (in `app.json`)
