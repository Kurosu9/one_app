import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import { app } from '../firebaseConfig'; // Импортируйте настройки Firebase

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
  const [formattedDate, setFormattedDate] = useState("dd.mm.yyyy");
  const [show, setShow] = useState(false);

  const router = useRouter();
  const auth = getAuth(app); // Используем Firebase Authentication
  const db = getFirestore(app); // Используем Firebase Firestore для хранения данных

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

    try {
      // Регистрируем пользователя в Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
      Alert.alert('Ошибка регистрации');
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
      formattedDate !== "dd.mm.yyyy"
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SIGN UP</Text>

        <Text style={styles.subtitle}>Registration for 14-15 age click here</Text>
        
        <Text style={styles.label}>INN</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your INN"
          autoCapitalize="none"
          keyboardType="numeric"
          value={inn}
          onChangeText={setInn}
          maxLength={16}
        />

        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your INN"
          autoCapitalize="none"
          keyboardType="numeric"
          value={id}
          onChangeText={setId}
          maxLength={16}
        />

        <Text style={styles.label}>Surname</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your surname"
          value={surname}
          onChangeText={setSurname}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Patronymic</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your patronymic"
          value={patronymic}
          onChangeText={setPatronymic}
        />

        <Text style={styles.label}>Phone number</Text>
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

        <Text style={styles.label}>Date of birth</Text>
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

        <Text style={styles.label}>Sex</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={sex}
            onValueChange={(itemValue) => setSex(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select your sex" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

        <Text style={styles.label}>City/Region</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city/region"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Repeat password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password again"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, !isFormValid() && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
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
  subtitle: {
    fontSize: 16,
    color: '#FB8C00',
    marginVertical: 10,
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
  button: {
    backgroundColor: '#00ACC1',
    padding: 20,
    marginVertical: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
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
