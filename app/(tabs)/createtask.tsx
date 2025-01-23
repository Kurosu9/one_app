import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

export default function Tab() {
  const [choice, setChoice] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.label}>Work for</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your price"
                  autoCapitalize="none"
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.description}
                  placeholder="Write your text"
                  autoCapitalize="none"
                  multiline={true}
                  textAlignVertical="top"
                />
                <Text style={styles.label}>Select the method to receive the message</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={choice}
                        onValueChange={(itemValue) => setChoice(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select messager" value="" />
                        <Picker.Item label="Telegram" value="male" />
                        <Picker.Item label="WhatsApp" value="female" />
                    </Picker>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Publish</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    pickerWrapper: {
        height: 45,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 60,
        width: '100%',
        color: '#4A4C4B',
        backgroundColor: '#fff',
        marginTop: -9,
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
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    description: {
        width: '100%',
        height: 182,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',

    },
    price: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: "row",
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#a6a6a6',
    },
    sort: {
        marginTop: -15,
    },
    radioCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#A6A6A6',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    selectedCircle: {
        borderColor: '#fb8c00',
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#fb8c00',
    },
    selectedText: {
        marginTop: 20,
        paddingBottom: 13,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#fb8c00',
        padding: 20,
        marginVertical: 30,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        height: 50,
        margin: 'auto',
        marginBottom: 70,
    },
    buttonText: {
        fontSize: 20,
        height: 30,
        color: 'white',
        marginTop: -9,
        fontWeight: 500,
    },
});
