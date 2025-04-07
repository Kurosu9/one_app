import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function PaymentMethods() {
  const [cardNumber, setCardNumber] = useState('');

  const handleAddCard = () => {
    if (!/^\d{16}$/.test(cardNumber)) {
      Alert.alert('Ошибка', 'Номер карты должен содержать 16 цифр');
      return;
    }
    Alert.alert('Успех', 'Карта привязана (заглушка Finik API)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Привязать карту</Text>
      <TextInput
        placeholder="Номер карты (0000 0000 0000 0000)"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        maxLength={16}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#00ACC1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});