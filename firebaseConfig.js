import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Импортируем Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDAmEdgL4DBHYzemq9dGgbXkhfGoz2NH8Y',
  authDomain: 'onedayjob-7a007.firebaseapp.com',
  projectId: 'onedayjob-7a007',
  storageBucket: 'onedayjob-7a007.firebasestorage.app',
  messagingSenderId: '264373560836',
  appId: '1:264373560836:web:22b4c4c89de0977736b751'
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация аутентификации с сохранением в AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Инициализация Firestore
const db = getFirestore(app);

export { app, auth, db }; // Экспортируем также db
