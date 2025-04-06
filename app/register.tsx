import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import { app } from '../firebaseConfig';

const RegisterScreen = () => {
  const [inn, setInn] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sex, setSex] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("дд.мм.гггг");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const formatDate = (date: Date) => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
  
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
    }
    
    if (Platform.OS === 'ios') {
      setShow(false);
    }
    
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/[^\d+]/g, '');
    const formatted = cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Пароли не совпадают!');
      return;
    }

    setIsLoading(true);

    try {
      // Проверка на наличие уже зарегистрированного email
      const existingUser = await fetchSignInMethodsForEmail(auth, email);
      if (existingUser && existingUser.length > 0) {
        Alert.alert("Этот email уже используется");
        return;
      }

      // Регистрируем пользователя в Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User UID:', user.uid);

      // Сохраняем дополнительные данные в Firestore
      await setDoc(doc(db, 'users', user.uid), {
        inn,
        id,
        surname,
        name,
        patronymic,
        phoneNumber,
        birthdate: formattedDate, // Сохраняем дату рождения как строку
        sex,
        location,
        email,
      });

      // Перенаправляем на экран Dashboard после успешной регистрации
      router.push('/dashboard');
    } catch (error) {
      let errorMessage = "Ошибка регистрации";
      
      // Проверяем тип ошибки
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Этот email уже зарегистрирован";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Неверный формат email";
      } else {
        errorMessage = error.message;
      }
  
      Alert.alert('Ошибка регистрации', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция проверки на заполненность всех полей
  const isFormValid = () => {
    return (
      inn &&
      id &&
      email &&
      location &&
      password &&
      confirmPassword &&
      sex &&
      name &&
      surname &&
      patronymic &&
      phoneNumber &&
      formattedDate !== "дд.мм.гггг"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>РЕГИСТРАЦИЯ</Text>
        
        <Text style={styles.label}>ИНН</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваш ИНН"
          autoCapitalize="none"
          keyboardType="numeric"
          value={inn}
          onChangeText={setInn}
          maxLength={16}
        />

        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваш ID"
          autoCapitalize="none"
          keyboardType="numeric"
          value={id}
          onChangeText={setId}
          maxLength={16}
        />

        <Text style={styles.label}>Фамилия</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите вашу фамилию"
          value={surname}
          onChangeText={setSurname}
        />

        <Text style={styles.label}>Имя</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваше имя"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Отчество</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваше отчество"
          value={patronymic}
          onChangeText={setPatronymic}
        />

        <Text style={styles.label}>Номер телефона</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="+996 555 555 555"
          keyboardType="phone-pad"
          maxLength={16}
          onFocus={() => {
            if (phoneNumber === '') {
              setPhoneNumber('+');
            }
          }}
        />

        <Text style={styles.label}>Дата рождения</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.input}>
          <Text style={styles.inputDate}>{formattedDate}</Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <Text style={styles.label}>Пол</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={sex}
            onValueChange={(itemValue) => setSex(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Выберите пол" value="" />
            <Picker.Item label="Мужской" value="male" />
            <Picker.Item label="Женский" value="female" />
          </Picker>
        </View>

        <Text style={styles.label}>Город/Регион</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваш город/регион"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите ваш email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Повторите пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите пароль еще раз"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {isLoading ? (
          <ActivityIndicator style={styles.loading} size="large" color="#fb8c00"/>
        ) : (
          <TouchableOpacity
            style={[styles.button, !isFormValid() && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid()}
          >
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FBF8',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
  },
  label: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    width: '100%',
    color: '#4A4C4B',
    backgroundColor: '#fff',
    marginTop: -5,
  },
  inputDate: {
    fontSize: 15,
    color: '#333',
    marginVertical: 'auto',
  },
  loading: {
    marginBottom: 30,
    height: 120,
  },
  button: {
    backgroundColor: '#00ACC1',
    padding: 20,
    marginVertical: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    height: 50,
    margin: 'auto',
    marginBottom: 70,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 20,
    height: 30,
    color: 'white',
    marginTop: -8,
    fontWeight: 500,
  },
});

export default RegisterScreen;