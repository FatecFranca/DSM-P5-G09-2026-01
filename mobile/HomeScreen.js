import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { trackEvent } from './Tracker';

const PRODUCTS = [
  { id: 'p1', name: 'Fone AirPro Bluetooth', price: 'R$ 299,90', oldPrice: 'R$ 399,90', rating: '★★★★★', tag: 'Destaque' },
  { id: 'p2', name: 'Smartwatch Pulse Elite', price: 'R$ 450,00', oldPrice: 'R$ 550,00', rating: '★★★★☆', tag: 'Novo' },
  { id: 'p3', name: 'Câmera Sport 4K', price: 'R$ 1.200,00', oldPrice: 'R$ 1.500,00', rating: '★★★★★', tag: 'Oferta' },
  { id: 'p4', name: 'Mochila Tech Impermeável', price: 'R$ 180,00', oldPrice: 'R$ 220,00', rating: '★★★☆☆', tag: null },
  { id: 'p5', name: 'Mouse Gamer RGB', price: 'R$ 120,00', oldPrice: 'R$ 160,00', rating: '★★★★☆', tag: 'Mais Vendido' },
  { id: 'p6', name: 'Teclado Mecânico Pro', price: 'R$ 350,00', oldPrice: 'R$ 499,00', rating: '★★★★★', tag: 'Oferta' },
];

export default function HomeScreen({ route, navigation }) {
  const { version } = route.params;
  const mountTime = useRef(performance.now());
  const isA = version === 'A';

  useEffect(() => {
    const renderTime = performance.now() - mountTime.current;
    trackEvent('render_time', { pageName: 'Início', renderTime });
  }, []);

  useFocusEffect(
    useCallback(() => {
      trackEvent('page_view', { pageName: 'Início' });
    }, [])
  );

  const handleProductClick = (product) => {
    trackEvent('click', { pageName: 'Home', buttonName: `Clicou Produto: ${product.name}` });
    navigation.navigate('Details', { product, version });
  };

  const handleBannerClick = () => {
    trackEvent('click', { pageName: 'Home', buttonName: 'Banner Promocional' });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productCard, isA ? styles.productCardA : styles.productCardB]} 
      onPress={() => handleProductClick(item)}
      activeOpacity={0.8}
    >
      {item.tag && !isA && <View style={styles.tagB}><Text style={styles.tagTextB}>{item.tag}</Text></View>}
      {item.tag && isA && <View style={styles.tagA}><Text style={styles.tagTextA}>{item.tag}</Text></View>}
      
      <View style={styles.imagePlaceholder}>
         <Text style={{color: '#ccc', fontWeight: 'bold'}}>FOTO</Text>
      </View>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.rating}>{item.rating}</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>{item.oldPrice}</Text>
        <Text style={[styles.productPrice, isA ? styles.priceA : styles.priceB]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, isA ? styles.headerA : styles.headerB]}>
        <Text style={styles.title}>{isA ? 'Catálogo de Eletrônicos' : '🔥 OFERTAS RELÂMPAGO 🔥'}</Text>
        <Text style={styles.subtitle}>{isA ? 'Encontre o que precisa' : 'Aproveite agora mesmo!'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* BANNER A/B */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleBannerClick}>
          <View style={[styles.banner, isA ? styles.bannerA : styles.bannerB]}>
            <Text style={isA ? styles.bannerTextA : styles.bannerTextB}>
              {isA ? "10% de desconto na primeira compra. Use: BEMVINDO" : "ÚLTIMAS HORAS DE FRETE GRÁTIS!"}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          {isA ? "Mais populares" : "Recomendados para você"}
        </Text>

        <FlatList
          data={PRODUCTS}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false} // Flatlist inside ScrollView requires this or a height
        />
      </ScrollView>

      {/* BOTTOM NAVIGATION SIMULATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => {}}>
           <Text style={[styles.navText, {color: '#3b82f6', fontWeight: 'bold'}]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Cart', { version })}>
           <Text style={styles.navText}>Carrinho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Profile', { version })}>
           <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f5' },
  header: { padding: 25, paddingTop: 50, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  headerA: { backgroundColor: '#3b82f6' }, // Indigo variant
  headerB: { backgroundColor: '#18181b' }, // Dark variant
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#e4e4e7', textAlign: 'center', marginTop: 5 },
  
  banner: { marginHorizontal: 15, marginVertical: 15, padding: 20, borderRadius: 12 },
  bannerA: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#93c5fd' },
  bannerB: { backgroundColor: '#fef2f2', borderStyle: 'dashed', borderWidth: 2, borderColor: '#ef4444' },
  bannerTextA: { color: '#1e40af', fontWeight: 'bold', textAlign: 'center' },
  bannerTextB: { color: '#b91c1c', fontWeight: '900', textAlign: 'center', fontSize: 16 },

  sectionTitle: { paddingHorizontal: 15, fontSize: 18, fontWeight: 'bold', color: '#3f3f46', marginBottom: 10 },

  listContainer: { paddingHorizontal: 10 },
  productCard: { flex: 1, margin: 5, padding: 12, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
  
  productCardA: { borderColor: '#e4e4e7', borderWidth: 1 }, 
  productCardB: { shadowColor: '#ef4444', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }, 

  imagePlaceholder: { height: 100, backgroundColor: '#f1f5f9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  
  productName: { fontSize: 14, fontWeight: '600', color: '#27272a', marginBottom: 4, minHeight: 38 },
  rating: { fontSize: 12, color: '#f59e0b', marginBottom: 8 },
  
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' },
  oldPrice: { fontSize: 12, textDecorationLine: 'line-through', color: '#a1a1aa' },
  productPrice: { fontSize: 16, fontWeight: 'bold' },
  priceA: { color: '#3b82f6' },
  priceB: { color: '#10b981' }, // Aggressive green

  tagA: { position: 'absolute', top: -5, right: -5, backgroundColor: '#3b82f6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, zIndex: 10 },
  tagTextA: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  tagB: { position: 'absolute', top: 10, left: 0, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 3, borderTopRightRadius: 8, borderBottomRightRadius: 8, zIndex: 10 },
  tagTextB: { color: '#fff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },

  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, borderTopWidth: 1, borderColor: '#e4e4e7', justifyContent: 'space-around' },
  navBtn: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 12, color: '#71717a' }
});
