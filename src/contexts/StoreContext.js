// StoreContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Buscar produtos disponíveis para venda (publicados e com estoque)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supplementsRef = collection(db, 'supplements');
      // Query para buscar apenas produtos publicados e ativos
      const q = query(
        supplementsRef,
        where('publicado', '==', true),
        where('ativo', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const productsList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Só mostrar produtos com estoque disponível
        if (data.quantidade > 0) {
          productsList.push({
            id: doc.id,
            ...data,
            // Adicionar campos calculados para a loja
            disponivel: data.quantidade > 0,
            promocao: false, // Pode ser implementado depois
            categoria: data.categoria || 'Sem categoria'
          });
        }
      });
      
      // Ordenar por categoria e nome
      productsList.sort((a, b) => {
        if (a.categoria !== b.categoria) {
          return a.categoria.localeCompare(b.categoria);
        }
        return (a.nome || '').localeCompare(b.nome || '');
      });
      
      // Atualizar estado com produtos filtrados
      setProducts(productsList);
    } catch (error) {
      setError('Erro ao carregar produtos: ' + error.message);
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos na inicialização
  useEffect(() => {
    fetchProducts();
  }, []);

  // Função de adicionar itens ao carrinho
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Se já existe, atualiza a quantidade
        return prevCart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantidadeCarrinho: Math.min(
                  item.quantidadeCarrinho + quantity, 
                  product.quantidade
                )
              }
            : item
        );
      } else {
        // Se não existe, adiciona novo item
        return [...prevCart, {
          ...product,
          quantidadeCarrinho: Math.min(quantity, product.quantidade)
        }];
      }
    });
  };

  // Função de deletar itens do carrinho
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

const clearCart = () => {
    setCart([]);
  };

  // Atualizar quantidade de um item no carrinho
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { 
              ...item, 
              quantidadeCarrinho: Math.min(newQuantity, item.quantidade)
            }
          : item
      )
    );
  };

  // Cálculos do carrinho
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.precoVenda * item.quantidadeCarrinho);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantidadeCarrinho, 0);
  };

  // Filtrar produtos
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      (product.nome || '').toLowerCase().includes(term) ||
      (product.marca || '').toLowerCase().includes(term) ||
      (product.categoria || '').toLowerCase().includes(term) ||
      (product.descricao || '').toLowerCase().includes(term)
    );
  };

  const filterProductsByCategory = (category) => {
    if (!category || category === 'Todas') return products;
    return products.filter(product => product.categoria === category);
  };

  // Obter categorias únicas
  const getCategories = () => {
    const categories = [...new Set(products.map(p => p.categoria))];
    return categories.sort();
  };

  const value = {
    // Estados
    products,
    cart,
    loading,
    error,
    cartOpen,
    
    // Funções de produtos
    fetchProducts,
    searchProducts,
    filterProductsByCategory,
    getCategories,
    
    // Funções do carrinho
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setCartOpen,
    
    // Cálculos
    getCartTotal,
    getCartItemsCount
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
