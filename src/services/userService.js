// userService.js
import { doc, getDoc } from 'firebase/firestore';
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
      // Se não existe documento de usuário, usar dados básicos
      userInfo = {
        displayName: 'Fornecedor',
        email: 'contato@fornecedor.com',
        photoURL: null
      };
    }

    // Adicionar ao cache
    userCache.set(userId, userInfo);
    return userInfo;
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return {
      displayName: 'Fornecedor',
      email: 'contato@fornecedor.com',
      photoURL: null
    };
  }
};

// Função para limpar cache quando necessário
export const clearUserCache = () => {
  userCache.clear();
};
