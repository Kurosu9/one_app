import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity} from 'react-native';


const NotificationScreen = () => {

    const [activeTab, setActiveTab] = useState('new'); // New tab is the default

        const renderTabContent = () => {
            if (activeTab === 'new') {
                return (
                    <View>
                        <Text style={styles.month}>November</Text>
                        <View style={styles.card}>
                            <View style={styles.card_title}>
                                <Text style={styles.card_title1}>OneDayOneJob</Text>
                                <TouchableOpacity>
                                    <Text style={styles.card_title2}>06.11.2024</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.card_description}>
                                Lorem ipsum dolor sit amet consectetur.
                                Mauris amet urna volutpat ornare enim praesent elit vitae.
                                Sed ultrices nulla in vitae. Vel faucibus non posuere rhoncus posuere quis
                                posuere in in. Nisi enim aliquet etiam nisi facilisis enim erat commodo tellus.
                            </Text>
                        </View>
                    </View>
                );
            }
            if (activeTab === 'responds') {
                return (
                    <Text>Responds Tab Content</Text>
                );
            }
        };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                        onPress={() => setActiveTab('new')}
                    >
                        <Text style={[styles.tabText]}>Systemic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'responds' && styles.activeTab]}
                        onPress={() => setActiveTab('responds')}
                    >
                        <Text style={[styles.tabText]}>Hirer</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {renderTabContent()}
                </View>
            </View>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 45,
        marginTop: 15,
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
    },
    card_title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    card_title1: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card_title2: {
        fontSize: 13,
        fontWeight: 'bold',
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
    month: {
        fontSize: 22,
        fontWeight: 500,
        marginVertical: 10,
    },
});

export default NotificationScreen;