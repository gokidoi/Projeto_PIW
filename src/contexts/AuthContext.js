// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Firebase Auth initializing...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      
      if (user) {
        // Salvar dados do usuário no Firestore quando logar
        try {
          await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName || 'Usuário',
            email: user.email,
            photoURL: user.photoURL || null,
            lastLogin: new Date().toISOString()
          }, { merge: true }); // merge: true para não sobrescrever outros dados
          
          console.log('Dados do usuário salvos no Firestore');
        } catch (error) {
          console.warn('Erro ao salvar dados do usuário:', error);
        }
      }
      
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting Google sign in...');
      console.log('Auth instance:', auth);
      console.log('Google provider:', googleProvider);
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user.email);
      
      // Salvar dados do usuário no Firestore
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          displayName: result.user.displayName || 'Usuário',
          email: result.user.email,
          photoURL: result.user.photoURL || null,
          lastLogin: new Date().toISOString()
        }, { merge: true });
        
        console.log('Dados do usuário salvos no Firestore durante login');
      } catch (saveError) {
        console.warn('Erro ao salvar dados durante login:', saveError);
      }
      
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Detailed error:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
        operationType: error.operationType
      });
      
      let errorMessage = 'Erro ao fazer login. ';
      
      switch (error.code) {
        case 'auth/configuration-not-found':
          errorMessage += 'Configuração do Google Sign-In não encontrada. Verifique as configurações do Firebase.';
          break;
        case 'auth/popup-blocked':
          errorMessage += 'Popup foi bloqueado pelo navegador. Permita popups para este site.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage += 'Login cancelado pelo usuário.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage += 'Domínio não autorizado. Adicione este domínio às configurações do Firebase.';
          break;
        default:
          errorMessage += error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
