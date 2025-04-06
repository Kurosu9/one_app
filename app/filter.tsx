import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

const FilterScreen = () => {
    const [choice, setChoice] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const options = ['По умолчанию', 'Сначала новые', 'Сначала дороже'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.label}>Возраст</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={choice}
                        onValueChange={(itemValue) => setChoice(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Выберите возраст" value="" />
                        <Picker.Item label="13-15 лет" value="13-15" />
                        <Picker.Item label="16-22 года" value="16-22" />
                        <Picker.Item label="23-45 лет" value="23-45" />
                    </Picker>
                </View>
                
                <Text style={styles.label}>Категория</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={choice}
                        onValueChange={(itemValue) => setChoice(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Выберите категорию" value="" />
                        <Picker.Item label="Уборка" value="cleaning" />
                        <Picker.Item label="Физический труд" value="manual" />
                        <Picker.Item label="Няня" value="nanny" />
                    </Picker>
                </View>
                
                <Text style={styles.label}>Местоположение</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={choice}
                        onValueChange={(itemValue) => setChoice(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Выберите город" value="" />
                        <Picker.Item label="Бишкек" value="bishkek" />
                        <Picker.Item label="Ош" value="osh" />
                        <Picker.Item label="Нарын" value="naryn" />
                    </Picker>
                </View>
                
                <Text style={styles.label}>Цена</Text>
                <View style={styles.price}>
                    <TextInput
                        style={styles.input}
                        placeholder="От 0"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="До 999999"
                        keyboardType="numeric"
                    />
                </View>
                
                <Text style={styles.label}>Сортировка</Text>
                <View style={styles.sort}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioButtonContainer}
                            onPress={() => setSelectedOption(option)}
                        >
                            <Text style={styles.selectedText}>{option}</Text>
                            <View style={[styles.radioCircle, selectedOption === option && styles.selectedCircle]}>
                                {selectedOption === option && <View style={styles.innerCircle} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Показать</Text>
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
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        width: '45%',
        height: 45,
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
        fontWeight: '500',
    },
});

export default FilterScreen;