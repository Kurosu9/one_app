import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';



const RegisterScreen = () => {
  const [sex, setSex] = useState('');

  const router = useRouter();
  
  const handleLogin = () => {
    router.push('/dashboard');
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState("dd.mm.yyyy");

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
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (text: string) => {
    if (text === '' || /^[+]?[0-9]*$/.test(text)) {
      setPhoneNumber(text);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SIGN UP</Text>

        <Text style={styles.subtitle}>Registration for 13-15 age click here</Text>
        
        <Text style={styles.label}>INN</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your INN"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Surname</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your surname"
          secureTextEntry
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          secureTextEntry
        />

        <Text style={styles.label}>Patronymic</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your patronymic"
          secureTextEntry
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="+996 (555) 555-5555"
          keyboardType="phone-pad"
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
          secureTextEntry
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Text style={styles.label}>Repeat password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password again"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  buttonText: {
    fontSize: 20,
    height: 30,
    color: 'white',
    marginTop: -8,
    fontWeight: 500,
  },
});

export default RegisterScreen;
