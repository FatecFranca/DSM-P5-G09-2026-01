import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackEvent } from './Tracker';

export default function CartScreen({ route, navigation }) {
  const { version } = route.params;
  const isA = version === 'A';
  const mountTime = useRef(performance.now());
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
      const currentCart = await AsyncStorage.getItem('@cart');
      if (currentCart) {
        const parsed = JSON.parse(currentCart);
        setCartItems(parsed);
        
        let sum = 0;
        parsed.forEach(item => {
           // parse "R$ 299,90" to 299.90
           const num = parseFloat(item.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
           if (!isNaN(num)) sum += num;
        });
        setTotal(sum);
      }
    };
    loadCart();

    const renderTime = performance.now() - mountTime.current;
    trackEvent('page_view', { pageName: 'Cart' });
    trackEvent('render_time', { pageName: 'Cart', renderTime });
  }, []);

  const handleAction = (btn) => {
    trackEvent('click', { pageName: 'Carrinho', buttonName: 'Botão Finalizar Compra' });
    alert('Tentativa de finalizar compra registrada!');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>
      
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>R$ {total.toFixed(2).replace('.', ',')}</Text>
      </View>

      {/* EXPERIMENTO: Botao embaixo X Botao no topo */}
      <View style={[styles.checkoutContainer, isA ? styles.checkoutA : styles.checkoutB]}>
         <TouchableOpacity style={[styles.btn, isA ? styles.btnA : styles.btnB]} onPress={() => handleAction('Finalizar_Carrinho')}>
            <Text style={styles.btnText}>FINALIZAR COMPRA</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fcfcfc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  emptyText: { textAlign: 'center', marginVertical: 30, color: '#666', fontSize: 16 },
  item: { padding: 15, backgroundColor: '#fff', borderRadius: 8, elevation: 1, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 16 }, itemPrice: { fontWeight: 'bold' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#eee', paddingTop: 20, marginBottom: 30 },
  totalText: { fontSize: 18 }, totalPrice: { fontSize: 22, fontWeight: 'bold' },
  
  checkoutContainer: { marginTop: 'auto'},
  checkoutA: { alignItems: 'center' },
  checkoutB: { padding: 20, backgroundColor: '#111827', borderRadius: 15 },
  
  btn: { padding: 18, borderRadius: 8, width: '100%'},
  btnA: { backgroundColor: '#3b82f6'},
  btnB: { backgroundColor: '#10b981'},
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold'}
});
