import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, setDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

export default function Tab() {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [method, setMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);
  const { TOKEN } = require('../../config');

  // Проверка статуса Telegram
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "users", userId), (userDoc) => {
      setIsTelegramConnected(!!userDoc.data()?.telegramChatId);
    });

    return () => unsubscribe();
  }, []);

  const generateCode = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Ошибка', 'Пользователь не авторизован');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      await setDoc(doc(db, "telegramCodes", code), {
        userId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      setGeneratedCode(code);
      Alert.alert(
        'Код для Telegram',
        `Отправьте этот код боту @YourBotName:\n\n${code}`,
        [
          {
            text: 'Открыть Telegram',
            onPress: () => Linking.openURL('https://t.me/YourBotName'),
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сгенерировать код');
    }
  };

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    
    if (selectedMethod === 'telegram' && !isTelegramConnected) {
      Alert.alert(
        'Требуется привязка Telegram',
        'Для получения уведомлений через Telegram необходимо привязать аккаунт',
        [
          {
            text: 'Привязать сейчас',
            onPress: generateCode
          },
          {
            text: 'Отмена',
            onPress: () => setMethod(''),
            style: 'cancel'
          }
        ]
      );
    }
  };

  const handlePublish = async () => {
    if (!price || !description || !currency || !method) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    Alert.alert(
      'Подтверждение',
      'Опубликовать задание?',
      [
        { text: 'Отменить', style: 'cancel' },
        {
          text: 'Опубликовать',
          onPress: async () => {
            setIsLoading(true);
            try {
              const userId = auth.currentUser?.uid;
              await addDoc(collection(db, 'tasks'), {
                price,
                description,
                currency,
                method,
                status: 'free',
                createdAt: new Date(),
                userId,
              });
              
              // Только Telegram-уведомление
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists() && userDoc.data().telegramChatId) {
                try {
                  const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Добавьте headers
                    body: JSON.stringify({
                      chat_id: userDoc.data().telegramChatId,
                      text: `✅ Задание опубликовано!\n${description}`,
                      parse_mode: 'Markdown' // Добавьте parse_mode
                    })
                  });
                  
                  if (!response.ok) {
                    console.error('Ошибка Telegram API:', await response.text());
                  }
                } catch (error) {
                  console.error('Ошибка отправки в Telegram:', error);
                }
              }

              Alert.alert('Успех!', 'Задание опубликовано!');
              setPrice('');
              setDescription('');
              setCurrency('');
              setMethod('');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось опубликовать');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.label}>Сумма вознаграждения</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите сумму"
            value={price}
            onChangeText={setPrice}
            autoCapitalize="none"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Валюта</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currency}
              onValueChange={(itemValue) => setCurrency(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Выберите валюту" value="" />
              <Picker.Item label="Сом" value="som" />
              <Picker.Item label="Доллар" value="dollar" />
            </Picker>
          </View>

          <Text style={styles.label}>Описание задания</Text>
          <TextInput
            style={styles.description}
            placeholder="Опишите ваше задание"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
          />
          
          <Text style={styles.label}>Способ получения уведомлений</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={method}
              onValueChange={handleMethodChange}
              style={styles.picker}
            >
              <Picker.Item label="Выберите метод" value="" />
              <Picker.Item label="Telegram" value="telegram" />
            </Picker>
          </View>

          {method === 'telegram' && !isTelegramConnected && (
            <View style={styles.telegramSection}>
              <Text style={styles.instructions}>
                Для получения уведомлений привяжите Telegram:
              </Text>
              {generatedCode ? (
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Ваш код:</Text>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{generatedCode}</Text>
                  </View>
                  <Text style={styles.codeInstructions}>
                    Отправьте этот код боту @YourBotName
                  </Text>
                  <TouchableOpacity
                    style={styles.telegramButton}
                    onPress={() => Linking.openURL('https://t.me/YourBotName')}
                  >
                    <MaterialIcons name="send" size={20} color="white" />
                    <Text style={styles.telegramButtonText}>Открыть Telegram</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.telegramButton}
                  onPress={generateCode}
                >
                  <MaterialIcons name="telegram" size={20} color="white" />
                  <Text style={styles.telegramButtonText}>Привязать Telegram</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {method === 'telegram' && isTelegramConnected && (
            <View style={styles.connectedContainer}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.connectedText}>Telegram привязан</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handlePublish} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Опубликовать</Text>
            )}
          </TouchableOpacity>
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
  telegramSection: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  connectedText: {
    marginLeft: 10,
    color: '#4CAF50',
    fontSize: 16,
  },
  instructions: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 10,
  },
  codeContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  codeLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  codeBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
    marginVertical: 5,
  },
  codeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  codeInstructions: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  telegramButton: {
    flexDirection: 'row',
    backgroundColor: '#0088CC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  telegramButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});