import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    router.push('/(tabs)/dashboard');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image 
          source={require('../assets/images/imagesapp/support.png')}
          style={styles.img}
        />
        <Text style={styles.title}>LOGIN</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  img: {
    width: 300,
    height: 300,
    marginTop: -50,
  },
  text: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  },
  button: {
    backgroundColor: '#00ACC1',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    height: 50,
    margin: 'auto',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    height: 30,
    color: 'white',
    marginTop: -8,
    fontWeight: 500,
  },
  link: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 500,
    color: '#FB8C00', 
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default LoginScreen;