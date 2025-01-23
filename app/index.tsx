import { useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';



const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/auth');
    }, 3000);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/imagesapp/logo.png')}
        style={styles.img}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4FBF8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  img: {
    width: 500,
    height: 500,
  },
});

export default SplashScreen;
