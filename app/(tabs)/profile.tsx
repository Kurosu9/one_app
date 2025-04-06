import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileTab() {
  const [userData, setUserData] = useState(null);
  const [rating, setRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserDataAndRating = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 1. Загружаем основные данные пользователя
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Если рейтинг уже есть в профиле, используем его
          if (data.rating !== undefined) {
            setRating(data.rating);
            setRatingCount(data.ratingCount || 0);
            setLoading(false);
            return;
          }
        }

        // 2. Если рейтинга нет, рассчитываем его из всех оценок
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('toUserId', '==', user.uid)
        );
        const querySnapshot = await getDocs(reviewsQuery);

        if (!querySnapshot.empty) {
          let totalRating = 0;
          querySnapshot.forEach((doc) => {
            totalRating += doc.data().rating;
          });
          
          const averageRating = totalRating / querySnapshot.size;
          const roundedRating = Math.round(averageRating * 10) / 10; // Округление до 1 знака
          
          setRating(roundedRating);
          setRatingCount(querySnapshot.size);
          
          // 3. Обновляем рейтинг в профиле пользователя
          await updateDoc(doc(db, 'users', user.uid), {
            rating: roundedRating,
            ratingCount: querySnapshot.size,
            lastRatingUpdate: new Date()
          });
        } else {
          setRating(null);
          setRatingCount(0);
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить рейтинг');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRating();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
      Alert.alert('Успех', 'Вы успешно вышли из системы');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      Alert.alert('Ошибка', 'Не удалось выйти из системы');
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert(
      'Удаление аккаунта',
      'Вы уверены? Это действие нельзя отменить. Все ваши данные будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Удаляем данные пользователя
              await deleteDoc(doc(db, 'users', user.uid));
              
              // Удаляем аккаунт
              await deleteUser(user);
              
              router.replace('/auth');
              Alert.alert('Успех', 'Аккаунт успешно удален');
            } catch (error) {
              console.error('Ошибка удаления:', error);
              Alert.alert('Ошибка', 'Не удалось удалить аккаунт');
            }
          }
        }
      ]
    );
  };

  const renderStars = () => {
    if (rating === null) return <Text style={styles.noRating}>Нет оценок</Text>;
  
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half' : 'star-outline'}
            size={23}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingValue}>
          {rating.toFixed(1)} ({ratingCount})
        </Text>
      </View>
    );
  };

  const getRatingWord = (count) => {
    const lastDigit = count % 10;
    if (count >= 11 && count <= 19) return 'оценок';
    if (lastDigit === 1) return 'оценка';
    if (lastDigit >= 2 && lastDigit <= 4) return 'оценки';
    return 'оценок';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#00ACC1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.card_title}>Профиль</Text>
        
        <View style={styles.card}>
          <View style={styles.card_img}>
            <Image 
              source={require('../../assets/images/myimages/user.png')} 
              style={styles.avatar}
            />
          </View>
          
          <View style={styles.card_info}>
            <Text style={styles.card_text}>Имя: {userData?.name || 'Не указано'}</Text>
            <Text style={styles.card_text}>Фамилия: {userData.surname || 'Не указана'}</Text>
            <Text style={styles.card_text}>Телефон: {userData?.phoneNumber || 'Не указан'}</Text>
            <Text style={styles.card_text}>Дата рождения: {userData.birthdate || 'Не указана'}</Text>

            <View style={styles.ratingSection}>
              <Text style={styles.rating_text}>Рейтинг:</Text>
              {renderStars()}
            </View>

          </View>
        </View>

        <Text style={[styles.card_title, { marginTop: 5, marginBottom: 10 }]}>Настройки</Text>
        
        <TouchableOpacity style={styles.set} onPress={handleSignOut}>
          <Entypo name="log-out" size={20} color="#FB8C00" />
          <Text style={styles.set_text}>Выйти из аккаунта</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.set} onPress={handleDeleteAccount}>
          <AntDesign name="deleteuser" size={20} color="#FB8C00" />
          <Text style={styles.set_text}>Удалить аккаунт</Text>
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
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  card_title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#00ACC1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  card_img: {
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  card_info: {
    flex: 1,
  },
  card_text: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  rating_text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
  },
  ratingSection: {
    marginTop: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingValue: {
    color: '#FFD700',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  noRating: {
    color: '#FFD700',
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    marginBottom: 10,
  },
  set_text: {
    fontSize: 16,
    marginLeft: 10,
  },
});