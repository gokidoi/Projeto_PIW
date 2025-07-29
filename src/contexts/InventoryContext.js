// InventoryContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Função para buscar todos os suplementos
  const fetchSupplements = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const supplementsRef = collection(db, 'supplements');
      // Simplificando a consulta - primeiro filtra por userId, depois ordena no cliente
      const q = query(
        supplementsRef, 
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const supplementsList = [];
      
      querySnapshot.forEach((doc) => {
        supplementsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Ordenar por nome no lado do cliente
      supplementsList.sort((a, b) => {
        const nameA = (a.nome || '').toLowerCase();
        const nameB = (b.nome || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setSupplements(supplementsList);
    } catch (error) {
      setError('Erro ao carregar suplementos: ' + error.message);
      console.error('Erro ao buscar suplementos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar novo suplemento
  const addSupplement = async (supplementData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const supplementWithUser = {
        ...supplementData,
        userId: user.uid,
        fornecedor: supplementData.fornecedor || user.email, // Usar email do usuário se fornecedor não especificado
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'supplements'), supplementWithUser);
      
      const newSupplement = {
        id: docRef.id,
        ...supplementWithUser
      };
      
      setSupplements(prev => [...prev, newSupplement]);
      return newSupplement;
    } catch (error) {
      setError('Erro ao adicionar suplemento: ' + error.message);
      console.error('Erro ao adicionar suplemento:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar suplemento
  const updateSupplement = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const supplementRef = doc(db, 'supplements', id);
      const dataWithTimestamp = {
        ...updateData,
        updatedAt: new Date()
      };
      
      await updateDoc(supplementRef, dataWithTimestamp);
      
      setSupplements(prev =>
        prev.map(supplement =>
          supplement.id === id
            ? { ...supplement, ...dataWithTimestamp }
            : supplement
        )
      );
    } catch (error) {
      setError('Erro ao atualizar suplemento: ' + error.message);
      console.error('Erro ao atualizar suplemento:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar suplemento
  const deleteSupplement = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteDoc(doc(db, 'supplements', id));
      
      setSupplements(prev =>
        prev.filter(supplement => supplement.id !== id)
      );
    } catch (error) {
      setError('Erro ao deletar suplemento: ' + error.message);
      console.error('Erro ao deletar suplemento:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para registrar venda
  const registerSale = async (supplementId, quantidadeSale, valorVenda) => {
    try {
      setLoading(true);
      setError(null);
      
      const supplement = supplements.find(s => s.id === supplementId);
      if (!supplement) {
        throw new Error('Suplemento não encontrado');
      }
      
      if (quantidadeSale > supplement.quantidade) {
        throw new Error('Quantidade vendida não pode ser maior que o estoque disponível');
      }
      
      // Criar registro de venda
      const saleData = {
        supplementId,
        nomeSuplemento: supplement.nome,
        marca: supplement.marca,
        categoria: supplement.categoria,
        quantidadeVendida: quantidadeSale,
        valorVenda,
        precoCompraUnitario: supplement.precoCompra,
        userId: user.uid,
        dataVenda: new Date(),
        createdAt: new Date()
      };
      
      // Salvar venda no Firestore
      await addDoc(collection(db, 'sales'), saleData);
      
      // Atualizar quantidade do suplemento
      const novaQuantidade = supplement.quantidade - quantidadeSale;
      await updateSupplement(supplementId, { 
        quantidade: novaQuantidade 
      });
      
      return saleData;
    } catch (error) {
      setError('Erro ao registrar venda: ' + error.message);
      console.error('Erro ao registrar venda:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar vendas
  const fetchSales = async () => {
    if (!user) return [];
    
    try {
      const salesRef = collection(db, 'sales');
      const q = query(salesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const salesList = [];
      querySnapshot.forEach((doc) => {
        salesList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return salesList;
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
      return [];
    }
  };

  // Carregar suplementos quando o usuário faz login
  useEffect(() => {
    const loadSupplements = async () => {
      if (user) {
        await fetchSupplements();
      } else {
        setSupplements([]);
      }
    };
    
    loadSupplements();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Funções auxiliares para relatórios
  const getSupplementsByCategory = () => {
    const categories = {};
    supplements.forEach(supplement => {
      const category = supplement.categoria || 'Sem categoria';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(supplement);
    });
    return categories;
  };

  const getLowStockSupplements = () => {
    return supplements.filter(supplement => 
      supplement.quantidade <= (supplement.estoqueMinimo || 0)
    );
  };

  const getExpiringSoon = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return supplements.filter(supplement => {
      if (!supplement.dataVencimento) return false;
      const expDate = new Date(supplement.dataVencimento);
      return expDate <= futureDate && expDate >= today;
    });
  };

  const getTotalValue = () => {
    return supplements.reduce((total, supplement) => {
      return total + (supplement.precoCompra * supplement.quantidade || 0);
    }, 0);
  };

  const getTotalSaleValue = () => {
    return supplements.reduce((total, supplement) => {
      return total + ((supplement.precoVenda || 0) * supplement.quantidade || 0);
    }, 0);
  };

  const getTotalProfit = () => {
    return supplements.reduce((total, supplement) => {
      const profit = ((supplement.precoVenda || 0) - (supplement.precoCompra || 0)) * supplement.quantidade;
      return total + profit;
    }, 0);
  };

  const getProfitMargin = () => {
    const totalCost = getTotalValue();
    const totalSale = getTotalSaleValue();
    
    if (totalCost === 0) return 0;
    
    return ((totalSale - totalCost) / totalCost) * 100;
  };

  const getSupplementsWithProfit = () => {
    return supplements.map(supplement => ({
      ...supplement,
      unitProfit: (supplement.precoVenda || 0) - (supplement.precoCompra || 0),
      totalProfit: ((supplement.precoVenda || 0) - (supplement.precoCompra || 0)) * supplement.quantidade,
      profitMargin: supplement.precoCompra > 0 ? 
        (((supplement.precoVenda || 0) - supplement.precoCompra) / supplement.precoCompra) * 100 : 0
    }));
  };

  // Funções para métricas de vendas
  const getSalesMetrics = async () => {
    const sales = await fetchSales();
    
    const totalVendas = sales.length;
    const valorTotalVendido = sales.reduce((total, sale) => total + (sale.valorVenda || 0), 0);
    const lucroRealVendas = sales.reduce((total, sale) => {
      const custoTotal = (sale.precoCompraUnitario || 0) * (sale.quantidadeVendida || 0);
      return total + ((sale.valorVenda || 0) - custoTotal);
    }, 0);
    
    return {
      totalVendas,
      valorTotalVendido,
      lucroRealVendas,
      vendasDetalhadas: sales
    };
  };

  const value = {
    supplements,
    loading,
    error,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    registerSale,
    fetchSales,
    getSalesMetrics,
    fetchSupplements,
    getSupplementsByCategory,
    getLowStockSupplements,
    getExpiringSoon,
    getTotalValue,
    getTotalSaleValue,
    getTotalProfit,
    getProfitMargin,
    getSupplementsWithProfit
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
