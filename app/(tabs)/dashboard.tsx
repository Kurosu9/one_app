import { StyleSheet, SafeAreaView, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { cloneElement, useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';


export default function Tab() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('new'); // New tab is the default
    const [tasks, setTasks] = useState([]); // Состояние для хранения задач
    const [filteredTasks, setFilteredTasks] = useState([]); // Состояние для отфильтрованных задач
    const [searchQuery, setSearchQuery] = useState(''); // Состояние для поиска

    useEffect(() => {
        const q = query(collection(db, 'tasks'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksList = [];
            querySnapshot.forEach((doc) => {
                tasksList.push({ id: doc.id, ...doc.data() });
            });
            setTasks(tasksList);
            setFilteredTasks(tasksList); // Инициализируем отфильтрованные задачи
        });

        return () => unsubscribe();
    }, []);

    // Фильтрация задач по статусу (вкладки New и Responds)
    useEffect(() => {
        if (activeTab === 'new') {
            setFilteredTasks(tasks.filter(task => task.status === 'free'));
        } else if (activeTab === 'responds') {
            setFilteredTasks(tasks.filter(task => task.status === 'under review' || task.status === 'hired'));
        }
    }, [activeTab, tasks]);

    // Поиск задач
    useEffect(() => {
        if (searchQuery) {
            const filtered = tasks.filter(task =>
                task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.price.toString().includes(searchQuery)
            );
            setFilteredTasks(filtered);
        } else {
            setFilteredTasks(tasks);
        }
    }, [searchQuery, tasks]);

    // Обработчик для кнопки "Respond"
    const handleRespond = async (taskId) => {
        try {
            await updateDoc(doc(db, 'tasks', taskId), {
                status: 'under review',
            });
            Alert.alert('Success', 'Your response has been submitted!');
        } catch (error) {
            console.error('Error updating task: ', error);
            Alert.alert('Error', 'Failed to submit response. Please try again.');
        }
    };

    const renderTabContent = () => {
        if (filteredTasks.length === 0) {
            return (
                <Text style={styles.noTasksText}>No tasks found.</Text>
            );
        }

        return filteredTasks.map((task) => (
            <View key={task.id} style={styles.card}>
                <View style={styles.card_title}>
                    <Text style={styles.card_title1}>Work for {task.price} {task.currency}</Text>
                    {activeTab === 'new' && (
                        <TouchableOpacity onPress={() => handleRespond(task.id)}>
                            <Text style={styles.card_title2}>Respond</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.card_description}>{task.description}</Text>
                <View style={styles.card_status}>
                    <Text style={styles.card_status1}>Status: </Text>
                    <Text style={styles.card_status2}>{task.status}</Text>
                </View>
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
                            placeholder='Search...'
                        />
                    </View>
                    <View style={styles.filter_not}>
                        <TouchableOpacity onPress={() => router.push('/filter')}>
                            <Feather name="filter" size={26} color="#FB8C00" style={styles.search_img}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/notification')}>
                            <Ionicons name="notifications-outline" size={28} color="#FB8C00" style={styles.search_img}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                        onPress={() => setActiveTab('new')}
                    >
                        <Text style={[styles.tabText]}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'responds' && styles.activeTab]}
                        onPress={() => setActiveTab('responds')}
                    >
                        <Text style={[styles.tabText]}>Responds</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {renderTabContent()}
                </View>
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
        // justifyContent: 'center',
        paddingHorizontal: 15,
        // margin: 6,
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
        width: "80%",
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
});