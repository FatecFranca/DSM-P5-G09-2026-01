import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { trackEvent } from './Tracker';

export default function ProfileScreen({ route }) {
  const { version } = route.params;
  const isA = version === 'A';
  const mountTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - mountTime.current;
    trackEvent('page_view', { pageName: 'Profile' });
    trackEvent('render_time', { pageName: 'Profile', renderTime });
  }, []);

  const handleClick = (readableName) => {
    trackEvent('click', { pageName: 'Perfil', buttonName: readableName });
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}><Text style={{color: '#fff', fontWeight: 'bold'}}>User</Text></View>
      <Text style={styles.name}>Hugo Silva</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('Ver Meus Pedidos')}>
          <Text style={styles.btnText}>Meus Pedidos</Text>
        </TouchableOpacity>
        
        {/* EXPERIMENTO: Mostrar link de assinatura em B */}
        {!isA && (
          <TouchableOpacity style={[styles.btn, styles.specialBtnB]} onPress={() => handleClick('Oferta VIP (Perfil)')}>
            <Text style={[styles.btnText, {color: '#fff'}]}>Seja Membro VIP ⭐</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.btn} onPress={() => handleClick('Acessar Configurações')}>
          <Text style={styles.btnText}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fcfcfc' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#9ca3af', justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 40 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 40 },
  actions: { width: '100%', gap: 15 },
  btn: { padding: 18, backgroundColor: '#f3f4f6', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  specialBtnB: { backgroundColor: '#8b5cf6', borderColor: '#7c3aed' },
  btnText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#374151' }
});
