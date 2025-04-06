import { StyleSheet, SafeAreaView, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { cloneElement, useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { getDoc, addDoc, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';

export default function Tab() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('new'); // Вкладка "Новые" по умолчанию
    const [tasks, setTasks] = useState([]); // Состояние для хранения задач
    const [filteredTasks, setFilteredTasks] = useState([]); // Состояние для отфильтрованных задач
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска
    const [isLoading, setIsLoading] = useState(true);
    const { TOKEN } = require('../../config');

    // Унифицированная загрузка и фильтрация задач
    useEffect(() => {
        setIsLoading(true);
        
        let q;
        if (activeTab === 'new') {
            // Для вкладки "Новые" - только свободные задачи, где текущий пользователь НЕ является создателем
            q = query(
                collection(db, 'tasks'),
                where('status', '==', 'free'),
                where('userId', '!=', auth.currentUser?.uid || '') // Исключаем свои задачи
            );
        } else if (activeTab === 'responds') {
            // Для вкладки "Мои отклики" - задачи где текущий пользователь является исполнителем
            if (!auth.currentUser?.uid) {
                setFilteredTasks([]);
                setIsLoading(false);
                return;
            }
            q = query(
                collection(db, 'tasks'),
                where('responderId', '==', auth.currentUser.uid),
                where('status', 'in', ['under review', 'hired']) // И задачи на рассмотрении, и принятые
            );
        } else {
            // Все задачи (если понадобится для других вкладок)
            q = query(collection(db, 'tasks'));
        }
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksList = [];
            querySnapshot.forEach((doc) => {
                const taskData = doc.data();
                // Добавляем только актуальные задачи (не старше 30 дней)
                const isRecent = !taskData.createdAt || 
                               (taskData.createdAt.toDate() > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
                
                if (isRecent) {
                    tasksList.push({ 
                        id: doc.id, 
                        ...taskData,
                        // Форматируем дату для отображения
                        formattedDate: taskData.createdAt?.toDate().toLocaleDateString() || 'N/A'
                    });
                }
            });
            
            // Сортируем по дате (новые сначала)
            tasksList.sort((a, b) => 
                (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
            );
            
            setTasks(tasksList);
            
            // Применяем поиск если есть запрос
            if (searchQuery) {
                const filtered = tasksList.filter(task =>
                    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.price.toString().includes(searchQuery) ||
                    (task.responderName && task.responderName.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                setFilteredTasks(filtered);
            } else {
                setFilteredTasks(tasksList);
            }
            
            setIsLoading(false);
        }, (error) => {
            console.error("Ошибка загрузки задач:", error);
            setIsLoading(false);
            Alert.alert("Ошибка", "Не удалось загрузить задачи");
        });
    
        return () => unsubscribe();
    }, [activeTab, auth.currentUser?.uid, searchQuery]);

    // Оптимизированный поиск
    useEffect(() => {
        if (!searchQuery) {
            setFilteredTasks(tasks);
            return;
        }
        
        const timer = setTimeout(() => {
            const filtered = tasks.filter(task =>
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.price.toString().includes(searchQuery)
            );
            setFilteredTasks(filtered);
        }, 300); // Задержка для debounce
            
        return () => clearTimeout(timer);
    }, [searchQuery, tasks]);

    // Обработчик для кнопки "Откликнуться"
    const handleRespond = async (taskId: string) => {
        try {
          const userId = auth.currentUser?.uid;
          if (!userId) {
            Alert.alert('Ошибка', 'Войдите в систему');
            return;
          }
      
          // Получаем данные задачи и пользователя
          const [taskDoc, userDoc] = await Promise.all([
            getDoc(doc(db, 'tasks', taskId)),
            getDoc(doc(db, 'users', userId))
          ]);
      
          if (!taskDoc.exists()) {
            Alert.alert('Ошибка', 'Задание не найдено');
            return;
          }
      
          const taskData = taskDoc.data();
          const userData = userDoc.data() || {};
      
          // Проверки статуса задачи
          if (taskData.status !== 'free') {
            Alert.alert('Уже занято', 'Это задание уже в работе');
            return;
          }
      
          if (taskData.userId === userId) {
            Alert.alert('Ошибка', 'Нельзя откликаться на свои задания');
            return;
          }
      
          // Безопасный расчет возраста
          const getAge = () => {
            try {
              // Если birthdate - Timestamp (Firestore)
              if (userData.birthdate?.toDate) {
                const birthDate = userData.birthdate.toDate();
                return new Date().getFullYear() - birthDate.getFullYear();
              }
              // Если birthdate - строка в формате "dd.mm.yyyy"
              if (typeof userData.birthdate === 'string') {
                const [day, month, year] = userData.birthdate.split('.');
                return new Date().getFullYear() - parseInt(year);
              }
            } catch (e) {
              console.warn('Ошибка расчета возраста:', e);
            }
            return null;
          };
      
          const age = getAge();
      
          Alert.alert('Подтверждение', 'Откликнуться на задание?', [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Да',
              onPress: async () => {
                setIsLoading(true);
                try {
                  // Обновляем задачу
                  await updateDoc(doc(db, 'tasks', taskId), {
                    status: 'under review',
                    responderId: userId,
                    responderData: {
                      name: userData.name || 'Аноним',
                      phone: userData.phoneNumber || 'Не указан',
                      age: age ? `${age} лет` : 'Не указан'
                    },
                    updatedAt: new Date()
                  });
      
                  // Отправляем уведомление в Telegram
                  const creatorDoc = await getDoc(doc(db, 'users', taskData.userId));
                  const creatorData = creatorDoc.data();
      
                  if (creatorData?.telegramChatId) {
                    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        chat_id: creatorData.telegramChatId,
                        text: `🆕 Новый отклик!\n\nЗадание: ${taskData.description}`,
                        reply_markup: {
                          inline_keyboard: [
                            [
                              { 
                                text: '📞 Контакты', 
                                callback_data: `show_${taskId}`
                              }
                            ],
                            [
                              { 
                                text: '✅ Принять', 
                                callback_data: `accept_${taskId}`
                              },
                              { 
                                text: '❌ Отклонить', 
                                callback_data: `reject_${taskId}`
                              }
                            ]
                          ]
                        }
                      })
                    });
                  }
      
                  Alert.alert('Успех', 'Отклик отправлен!');
                } catch (error) {
                  console.error('Ошибка:', error);
                  Alert.alert('Ошибка', 'Не удалось отправить отклик');
                } finally {
                  setIsLoading(false);
                }
              }
            }
          ]);
        } catch (error) {
          console.error('Ошибка handleRespond:', error);
          Alert.alert('Ошибка', 'Произошла ошибка');
        }
    };

    const renderTabContent = () => {
        if (filteredTasks.length === 0) {
            return <Text style={styles.noTasksText}>Задания не найдены.</Text>;
        }
    
        return filteredTasks.map((task) => (
            <View key={task.id} style={styles.card}>
                <View style={styles.card_title}>
                    <Text style={styles.card_title1}>Работа за {task.price} {task.currency}</Text>
                    
                    {activeTab === 'new' && task.status === 'under review' ? (
                        <View style={styles.pendingBadge}>
                            <Text style={styles.pendingText}>На рассмотрении</Text>
                        </View>
                    ) : activeTab === 'new' ? (
                        <TouchableOpacity onPress={() => handleRespond(task.id)}>
                            <Text style={styles.card_title2}>Откликнуться</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
                
                <Text style={styles.card_description}>{task.description}</Text>
                
                <View style={styles.card_status}>
                    <Text style={styles.card_status1}>Статус: </Text>
                    <Text style={[
                        styles.card_status2,
                        task.status === 'hired' && styles.statusHired,
                        task.status === 'under review' && styles.statusUnderReview
                    ]}>
                        {task.status === 'hired' ? 'Назначено' : 
                         task.status === 'under review' ? 'На рассмотрении' : 
                         task.status === 'free' ? 'Свободно' : task.status}
                    </Text>
                </View>
                
                {task.status === 'under review' && (
                    <Text style={styles.reviewNote}>
                        ⏳ Это задание сейчас рассматривается другим пользователем
                    </Text>
                )}
            </View>
        ));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.search}>
                    <View style={styles.searchbar}>
                        <Ionicons name="search-outline" size={20} color="black" style={styles.search_img}/>
                        <TextInput
                            style={styles.search_input}
                            placeholder='Поиск...'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <View style={styles.filter_not}>
                        <TouchableOpacity onPress={() => router.push('/filter')}>
                            <Feather name="filter" size={26} color="#FB8C00" style={styles.search_img}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                        onPress={() => setActiveTab('new')}
                    >
                        <Text style={[styles.tabText]}>Новые</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'responds' && styles.activeTab]}
                        onPress={() => setActiveTab('responds')}
                    >
                        <Text style={[styles.tabText]}>Мои отклики</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {renderTabContent()}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    )
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
    search: {
        display: "flex",
        flexDirection: "row",
    },
    searchbar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        paddingHorizontal: 12,
        width: "90%",
        backgroundColor: '#FFF',
        height: 40,
    },
    search_input: {
        fontSize: 14,
        flex: 1,
        height: 40,
    },
    search_img: {
        margin: 8,
        marginLeft: -1,
    },
    filter_not: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 70,
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: "#00ACC1",
    },
    tab: {
        paddingVertical: 6,
        paddingBottom: 30,
        borderRadius: 8,
        margin: 6,
        height: 33,
        width: 168,
    },
    activeTab: {
        backgroundColor: "#FB8C00",
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "white",
        textAlign: "center",
        width: 168,
        height: 33,
    },
    content: {
        marginTop: 7,
        paddingBottom: 7,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#a6a6a6',
        marginBottom: 10,
    },
    card_title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#a6a6a6',
        padding: 8,
    },
    card_title1: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    card_title2: {
        fontSize: 16,
        color: '#fb8c00',
        marginTop: 3,
    },
    card_description: {
        padding: 8,
        fontSize: 13,
    },
    card_status: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8,
    },
    card_status1: {
        fontSize: 13,
        color: '#fb8c00'
    },
    card_status2: {
        fontSize: 13,
        marginLeft: 3,
    },
    noTasksText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
    pendingBadge: {
        backgroundColor: '#FFE082',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    pendingText: {
        color: '#5D4037',
        fontSize: 12,
        fontWeight: '500',
    },
    statusHired: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    statusUnderReview: {
        color: '#FFA000',
        fontWeight: 'bold',
    },
    reviewNote: {
        fontSize: 12,
        color: '#616161',
        padding: 8,
        fontStyle: 'italic',
    },
});