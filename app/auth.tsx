import { View, TouchableOpacity, Image,  Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.block_buttons}>
            <Image 
              source={require('../assets/images/imagesapp/success.png')}
              style={styles.img}
            />
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/login')}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/register')}
            >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FBF8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  img: {
    width: 500,
    height: 530,
  },
  block_buttons: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00ACC1',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
    height: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
    marginTop: -5,
    height: 30,
    fontWeight: '600',
  },
});

export default AuthScreen;
