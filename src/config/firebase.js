import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_hZm4Hm_upXzmOJFsXVVSc6uGXDiWS6c",
    authDomain: "preventum-41940.firebaseapp.com",
    projectId: "preventum-41940",
    storageBucket: "preventum-41940.firebasestorage.app",
    messagingSenderId: "927922432524",
    appId: "1:927922432524:web:cb9878d3d194f4da071c29"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
});
