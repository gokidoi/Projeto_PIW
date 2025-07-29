// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6BukLvbAKb22xr9cxpMEotxPO1TAaksM",
  authDomain: "inventario-8b388.firebaseapp.com",
  projectId: "inventario-8b388",
  storageBucket: "inventario-8b388.firebasestorage.app",
  messagingSenderId: "892385434766",
  appId: "1:892385434766:web:d61fb85a54712e7fd9fddf",
  measurementId: "G-JG71DT4BF9"
};

console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...' // Não mostrar a chave completa no console
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar o provider do Google com configurações adicionais
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configurações adicionais para debug
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

console.log('Firebase initialized successfully');

export default app;
