// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

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
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
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
