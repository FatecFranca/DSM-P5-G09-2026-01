import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackEvent } from './Tracker';

export default function DetailsScreen({ route, navigation }) {
  const { product, version } = route.params;
  const mountTime = useRef(performance.now());
  const isA = version === 'A';

  useEffect(() => {
    const renderTime = performance.now() - mountTime.current;
    trackEvent('render_time', { pageName: 'Detalhes_Produto' });
  }, []);

  useFocusEffect(
    useCallback(() => {
      trackEvent('page_view', { pageName: 'Detalhes_Produto' });
    }, [product])
  );

  const handleInteract = async (buttonName) => {
    trackEvent('click', { pageName: 'Detalhes_Produto', buttonName });
    
    if (buttonName === 'Adicionar ao Carrinho' || buttonName === 'Comprar Agora') {
      try {
        const currentCart = await AsyncStorage.getItem('@cart');
        let parsed = currentCart ? JSON.parse(currentCart) : [];
        parsed.push(product);
        await AsyncStorage.setItem('@cart', JSON.stringify(parsed));
        alert(`${product.name} adicionado ao carrinho!`);
      } catch(e) {
        console.error(e);
      }
    } else {
      alert(`Você clicou em: "${buttonName}"`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>FOTO DO PRODUTO</Text>
      </View>

      <View style={styles.infoContainer}>
        {product.tag && (
          <View style={[styles.badge, isA ? styles.badgeA : styles.badgeB]}>
            <Text style={styles.badgeText}>{product.tag}</Text>
          </View>
        )}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.rating}>{product.rating} Avaliações de clientes</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.oldPrice}>De: {product.oldPrice}</Text>
          <Text style={[styles.price, isA ? styles.priceA : styles.priceB]}>Por apenas {product.price}!</Text>
        </View>

        <Text style={styles.description}>
          Este é um produto de alta qualidade com características premium. Aproveite as condições limitadas.
          Garantia de 12 meses e devolução grátis.
        </Text>
      </View>

      <View style={[styles.card, isA ? styles.cardA : styles.cardB]}>
        {/* ACTION TITLE */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.actionTitle}>Escolha uma ação:</Text>
          <TouchableOpacity onPress={() => handleInteract('Botão de Compartilhar (Share)')}>
             <Text style={{color: '#9ca3af', textDecorationLine: 'underline'}}>Compartilhar Produto</Text>
          </TouchableOpacity>
        </View>

        {/* VARIATION: 1 BIG BUTTON vs 2 BUTTONS SPLIT */}
        {isA ? (
          <View style={styles.actionsA}>
            <TouchableOpacity style={styles.btnA} onPress={() => handleInteract('Adicionar ao Carrinho')}>
              <Text style={styles.btnTextA}>ADICIONAR AO CARRINHO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutlineA} onPress={() => handleInteract('Lista de Desejos')}>
              <Text style={styles.btnOutlineTextA}>Colocar na lista de desejos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsB}>
            <TouchableOpacity style={styles.btnB_urgent} onPress={() => handleInteract('Comprar Agora')}>
              <Text style={styles.btnTextB_urgent}>COMPRAR AGORA - FALTAM 2 UND</Text>
            </TouchableOpacity>
            
            <View style={styles.rowB}>
              <TouchableOpacity style={styles.btnB_half} onPress={() => handleInteract('Ver Desconto PIX')}>
                <Text style={styles.btnTextB_half}>15% no Pix</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnB_half_var} onPress={() => handleInteract('Ver Parcelamento no Cartão')}>
                <Text style={styles.btnTextB_half}>10x Sem Juros</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagePlaceholder: { height: 250, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  imageText: { color: '#9ca3af', fontSize: 18, fontWeight: 'bold' },
  
  infoContainer: { padding: 20 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  badgeA: { backgroundColor: '#dbeafe' },
  badgeB: { backgroundColor: '#fef2f2' },
  badgeText: { fontWeight: 'bold', fontSize: 12, color: '#1f2937' },
  
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#1f2937' },
  rating: { fontSize: 14, color: '#f59e0b', marginBottom: 15 },
  
  priceContainer: { marginBottom: 20 },
  oldPrice: { fontSize: 14, textDecorationLine: 'line-through', color: '#9ca3af' },
  price: { fontSize: 32, fontWeight: '900' },
  priceA: { color: '#1e40af' }, // Dark Blue
  priceB: { color: '#059669' }, // Dark Green
  
  description: { fontSize: 15, color: '#64748b', lineHeight: 22 },

  card: { padding: 25, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  cardA: { backgroundColor: '#f8fafc', borderTopWidth: 1, borderColor: '#e2e8f0' },
  cardB: { backgroundColor: '#111827' },
  
  actionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#64748b' },

  // A Layout
  actionsA: { gap: 15 },
  btnA: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 10 },
  btnTextA: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  btnOutlineA: { backgroundColor: 'transparent', padding: 15, borderWidth: 1, borderColor: '#3b82f6', borderRadius: 10 },
  btnOutlineTextA: { color: '#3b82f6', textAlign: 'center', fontWeight: 'bold' },

  // B Layout
  actionsB: { gap: 10 },
  btnB_urgent: { backgroundColor: '#ef4444', padding: 18, borderRadius: 8 }, // Red Warning
  btnTextB_urgent: { color: '#fff', textAlign: 'center', fontWeight: '900', fontSize: 16 },
  rowB: { flexDirection: 'row', gap: 10 },
  btnB_half: { flex: 1, backgroundColor: '#059669', padding: 15, borderRadius: 8 },
  btnB_half_var: { flex: 1, backgroundColor: '#d97706', padding: 15, borderRadius: 8 },
  btnTextB_half: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
