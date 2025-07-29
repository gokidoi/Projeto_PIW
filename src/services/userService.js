// userService.js
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from './firebase';
import { db } from './firebase';

// Cache simples para evitar múltiplas consultas
const userCache = new Map();

export const getUserInfo = async (userId) => {
  // Verificar cache primeiro
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    let userInfo;
    if (userDoc.exists()) {
      userInfo = userDoc.data();
    } else {
      // Se não existe documento, buscar do usuário atual do Auth se for o mesmo
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        userInfo = {
          displayName: currentUser.displayName || 'Fornecedor',
          email: currentUser.email,
          photoURL: currentUser.photoURL || null
        };
        
        // Salvar os dados no Firestore para futuras consultas
        try {
          await setDoc(doc(db, 'users', userId), userInfo);
        } catch (saveError) {
          console.warn('Erro ao salvar dados do usuário:', saveError);
        }
      } else {
        // Para outros usuários que não existem no Firestore, usar dados genéricos
        userInfo = {
          displayName: 'Fornecedor',
          email: `fornecedor${userId.slice(-4)}@exemplo.com`,
          photoURL: null
        };
      }
    }

    // Adicionar ao cache
    userCache.set(userId, userInfo);
    return userInfo;
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return {
      displayName: 'Fornecedor',
      email: `fornecedor@exemplo.com`,
      photoURL: null
    };
  }
};

// Função para limpar cache quando necessário
export const clearUserCache = () => {
  userCache.clear();
};
