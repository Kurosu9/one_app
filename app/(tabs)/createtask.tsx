import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function Tab() {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [method, setMethod] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handlePublish = () => {
    if (!price || !description || !currency || !method) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля перед отправкой.');
      return;
    }


    Alert.alert(
      'Подтверждение отправки',
      'После отправки вашего объявления, вы не сможете его изменить. Вы уверены, что хотите продолжить?',
      [
        {
          text: 'Отменить',
          style: 'cancel',
        },
        {
          text: 'Отправить',
          onPress: async () => {
            setIsLoading(true);

            try {
              const docRef = await addDoc(collection(db, 'tasks'), {
                price,
                description,
                currency,
                method,
                status: 'free',
                createdAt: new Date(),
              });

              console.log('Document written with ID: ', docRef.id);
              
              setPrice('');
              setDescription('');
              setCurrency('');
              setMethod('');


              Alert.alert('Успех!', 'Ваше объявление было отправлено!');
            } catch (e) {
              console.error('Error adding document: ', e);
              Alert.alert('Ошибка', 'Не удалось отправить объявление. Попробуйте снова.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.label}>Work for</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your price"
            value={price}
            onChangeText={setPrice}
            autoCapitalize="none"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Currency</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currency}
              onValueChange={(itemValue) => setCurrency(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select currency" value="" />
              <Picker.Item label="Som" value="som" />
              <Picker.Item label="Dollar" value="dollar" />
            </Picker>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.description}
            placeholder="Write your text"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Select the method to receive the message</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={method}
              onValueChange={(itemValue) => setMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select messenger" value="" />
              <Picker.Item label="Telegram" value="telegram" />
              <Picker.Item label="WhatsApp" value="whatsapp" />
            </Picker>
          </View>

          {isLoading ? (
              <ActivityIndicator size="large" color="#fb8c00" />
            ) : (
              <TouchableOpacity 
                style={[styles.button, isLoading && { opacity: 0.7 }]} 
                onPress={handlePublish} 
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Publish</Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FBF8',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  pickerWrapper: {
    height: 45,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    width: '100%',
    color: '#4A4C4B',
    backgroundColor: '#fff',
    marginTop: -9,
  },
  label: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  description: {
    width: '100%',
    height: 182,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#fb8c00',
    padding: 20,
    marginVertical: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    height: 50,
    margin: 'auto',
    marginBottom: 70,
  },
  buttonText: {
    fontSize: 20,
    height: 30,
    color: 'white',
    marginTop: -9,
    fontWeight: '500',
  },
});
