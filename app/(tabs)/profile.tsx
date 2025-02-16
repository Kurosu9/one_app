import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';;

export default function Tab() {
  const [userData, setUserData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(userDocRef);
  
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            console.log('Fetched user data:', userData);
            setUserData(userData);
          } else {
            console.log('No such user document!');
          }
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      setUserData(null);
      router.replace('/auth');
      Alert.alert('Success', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out: ' + error);
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                // 1. Удаляем данные пользователя из Firestore
                await deleteDoc(doc(db, 'users', user.uid)); // Удаляем документ пользователя из коллекции users
  
                // 2. Удаляем пользователя из Firebase Authentication
                await deleteUser(user); // Удаляем пользователя из Authentication
  
                // 3. Выйти из системы и очистить данные
                console.log('Account deleted successfully');
                setUserData(null); // Очистить данные пользователя
                router.replace('/auth'); // Перенаправить на экран авторизации
  
                Alert.alert('Success', 'Your account has been deleted.');
              } catch (error) {
                console.error('Error deleting account:', error);
                Alert.alert('Error', 'Failed to delete account: ' + error);
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'No user is signed in.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.card_title}>Certificate</Text>
        <View style={styles.card}>
          <View style={styles.card_img}>
            <Image source={require('../../assets/images/myimages/user.png')} />
          </View>
          <View style={styles.card_info}>
            <View>
              {userData ? (
                <>
                  <Text style={styles.card_text}>Name: {userData.name}</Text>
                  <Text style={styles.card_text}>Surname: {userData.surname}</Text>
                  <Text style={styles.card_text}>Phone: {userData.phoneNumber}</Text>
                  <Text style={styles.card_text}>Birth Date: {userData.birthdate}</Text>
                </>
              ) : (
                <Text style={styles.card_text}>Loading...</Text>
              )}
            </View>
          </View>
        </View>
        <Text style={[styles.card_title, { marginTop: 5, marginBottom: 10 }]}>Settings</Text>
        <TouchableOpacity style={styles.set} onPress={handleSignOut}>
          <Entypo name="log-out" size={20} color="#FB8C00" style={{ height: 20 }} />
          <Text style={styles.set_text}>Sign out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.set} onPress={handleDeleteAccount}>
          <AntDesign name="deleteuser" size={20} color="#FB8C00" style={{ height: 20 }} />
          <Text style={styles.set_text}>Delete account</Text>
        </TouchableOpacity>
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
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  card_title: {
    fontSize: 24,
    fontWeight: '500',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 180,
    backgroundColor: '#00ACC1',
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  card_img: {
    margin: 10,
  },
  card_info: {
    marginVertical: 20,
  },
  card_text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  set: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    alignItems: 'center',
    padding: 13,
    borderRadius: 10,
    borderColor: '#A6A6A6',
    borderWidth: 1,
    marginBottom: 8,
  },
  set_text: {
    fontSize: 16,
    marginVertical: -5,
    marginLeft: 10,
  },
});
