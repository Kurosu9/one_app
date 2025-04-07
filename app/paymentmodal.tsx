import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PaymentModal({ visible, onClose, onConfirm, amount }) {
  const fee = Math.ceil(amount * 0.05);
  const total = amount + fee; 

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Оплата публикации</Text>
          
          <View style={styles.paymentDetails}>
            <Text style={styles.detailText}>Сумма вознаграждения: {amount} KGS</Text>
            <Text style={styles.detailText}>Комиссия системы (5%): {fee} KGS</Text>
            <Text style={styles.totalText}>Итого к оплате: {total} KGS</Text>
          </View>

          <Text style={styles.note}>
            Вознаграждение {amount} KGS будет заморожено до выполнения задания. 
            Комиссия {fee} KGS списывается сразу.
          </Text>

          <TouchableOpacity 
            style={styles.payButton}
            onPress={onConfirm}
          >
            <Text style={styles.payButtonText}>Подтвердить</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginVertical: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  payButton: {
    backgroundColor: '#00ACC1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelText: {
    textAlign: 'center',
    color: '#666',
  },
});