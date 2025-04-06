import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#00ACC1',
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
        },
        tabBarIconStyle: {
          alignSelf: 'center',
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Доска',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={40} color={color} width={40} height={40}/>
          ),
        }}
      />
      <Tabs.Screen
        name="createtask"
        options={{
          title: '',
          headerTitle: 'Создание задач',
          headerShown: true,
          // headerStyle: { backgroundColor: '#00ACC1', },
          // headerTintColor: '',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 500,
          },
          headerTitleAlign: 'center',
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={60} color={color} width={60} height={60} style={{marginTop: 10}}/>
          ),
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => {
                router.push('/dashboard');
              }}
              style={{ marginLeft: 15 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Мой профиль',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={35} color={color} width={35} height={35}/>
          ),
        }}
      />
    </Tabs>
  );
}
