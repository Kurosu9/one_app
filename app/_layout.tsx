import { Stack } from 'expo-router/stack';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Layout() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ 
          title: 'Notification',
          headerTintColor: 'black',
          headerTitleAlign: 'center',
          // headerStyle: {
          //   backgroundColor: '#f0f0f0',
          // },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 500,
          },
        }} />
      <Stack.Screen name="filter" options={{ 
          title: 'Filter',
          headerTintColor: 'black',
          headerTitleAlign: 'center',
          // headerStyle: {
          //   backgroundColor: '#f0f0f0',
          // },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 500,
          },
          headerRight: () => (
            <TouchableOpacity style={styles.cleanButton} onPress={() => console.log('Clean pressed')}>
              <Text style={styles.cleanText}>Clean</Text>
            </TouchableOpacity>
          ),
        }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cleanButton: {
    paddingRight: 15,
  },
  cleanText: {
    fontSize: 16,
    color: '#fb8c00',
    fontWeight: 'bold',
  },
});
