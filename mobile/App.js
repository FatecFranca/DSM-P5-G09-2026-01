import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Modal } from 'react-native';
import axios from 'axios';

// Usar o IP local caso esteja rodando fisicamente ou o dominio do tunnel. 
// Para emuladores Android use 10.0.2.2:3000
const API_URL = 'http://10.0.2.2:3000'; // Ajuste aqui para o endereço do seu tunnel "https://api.hugozera.space" ou do localhost

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [balance, setBalance] = useState(0);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, dashRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/dashboard`)
      ]);
      setTransactions(txRes.data.slice(0, 10)); // ultimas 10
      setBalance(dashRes.data.summary.balance);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || !category) {
      Alert.alert("Erro", "Preencha o valor e a categoria.");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/transactions`, {
        amount: parseFloat(amount.replace(',', '.')),
        category,
        description,
        type
      });
      setModalVisible(false);
      setAmount('');
      setDescription('');
      fetchData(); // atualizar
      Alert.alert("Sucesso", "Transação registrada!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar transação.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-950">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const formatBRL = (val) => `R$ ${parseFloat(val).toFixed(2).replace('.', ',')}`;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-6 pt-12 pb-24">
        
        <View className="mb-10">
          <Text className="text-zinc-400 text-sm mb-1 uppercase tracking-wider font-semibold">Saldo Disponível</Text>
          <Text className={`text-4xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatBRL(balance)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-xl font-bold">Recentes</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text className="text-indigo-400">Atualizar</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <Text className="text-zinc-500 italic">Nenhuma transação recente.</Text>
        ) : (
          transactions.map(tx => (
            <View key={tx.id} className="flex-row justify-between items-center bg-zinc-900 mb-3 p-4 rounded-2xl border border-zinc-800">
              <View>
                <Text className="text-white font-bold text-base">{tx.category}</Text>
                <Text className="text-zinc-500 text-xs mt-1">{tx.description || 'Sem descrição'}</Text>
              </View>
              <Text className={`font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-zinc-100'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB - Nova Transação */}
      <TouchableOpacity 
        className="absolute bottom-10 right-6 bg-indigo-500 w-16 h-16 rounded-full flex-1 justify-center items-center shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-4xl leading-10">+</Text>
      </TouchableOpacity>

      {/* Modal de Nova Transação */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-zinc-900 rounded-t-3xl p-6 h-[80%] border-t border-zinc-800">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl text-white font-bold">Nova Transação</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-zinc-400 text-lg">X</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row mb-6 bg-zinc-800 rounded-lg p-1">
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-lg items-center ${type === 'expense' ? 'bg-rose-500' : ''}`}
                onPress={() => setType('expense')}
              >
                <Text className={`font-bold ${type === 'expense' ? 'text-white' : 'text-zinc-400'}`}>Despesa</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className={`flex-1 py-3 rounded-lg items-center ${type === 'income' ? 'bg-emerald-500' : ''}`}
                onPress={() => setType('income')}
              >
                <Text className={`font-bold ${type === 'income' ? 'text-white' : 'text-zinc-400'}`}>Receita</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-zinc-400 mb-2">Valor</Text>
            <TextInput 
              className="bg-zinc-950 border border-zinc-800 text-white rounded-xl p-4 mb-4 text-lg"
              placeholder="0,00"
              placeholderTextColor="#52525b"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text className="text-zinc-400 mb-2">Categoria</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {['Alimentação', 'Transporte', 'Lazer', 'Contas', 'Educação', 'Salário'].map(cat => (
                <TouchableOpacity 
                  key={cat}
                  className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700 bg-zinc-800'}`}
                  onPress={() => setCategory(cat)}
                >
                  <Text className={category === cat ? 'text-white' : 'text-zinc-300'}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-zinc-400 mb-2">Descrição (Opcional)</Text>
            <TextInput 
              className="bg-zinc-950 border border-zinc-800 text-white rounded-xl p-4 mb-8"
              placeholder="Supermercado, Uber, etc."
              placeholderTextColor="#52525b"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity 
              className="bg-indigo-500 py-4 rounded-xl items-center"
              onPress={handleAddTransaction}
            >
              <Text className="text-white font-bold text-lg">Salvar Transação</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
