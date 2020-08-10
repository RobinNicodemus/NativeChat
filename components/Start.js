import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView } from 'react-native';;
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';


export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            color: ''
        }
    }

    render() {
        return (
            <ImageBackground source={require('../assets/Background-Image.png')} style={styles.imageBkg}>
                <Text style={styles.title}>Catchat</Text>
                <View style={styles.interactionsContainer}>
                    <View style={styles.inputIconBox}>
                        <AntDesign name="user" size={24} color="black" />
                        <TextInput
                            style={styles.nameInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Your Name'
                        />
                    </View>
                    <View style={styles.colorSelectionBox}>
                        <Text style={styles.text}>
                            Choose Background Color:
                        </Text>
                        <View style={styles.colorSelection}>
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#090C08' })}
                                style={[styles.colorButton, { backgroundColor: '#090C08' }]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#474056' })}
                                style={[styles.colorButton, { backgroundColor: '#474056' }]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#8A95A5' })}
                                style={[styles.colorButton, { backgroundColor: '#8A95A5' }]}
                            />
                            <TouchableOpacity
                                onPress={() => this.setState({ color: '#B9C6AE' })}
                                style={[styles.colorButton, { backgroundColor: '#B9C6AE' }]}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                    ><Text>Go to Chat</Text></TouchableOpacity>
                    {
                        Platform.OS === 'android' ?
                            <KeyboardAvoidingView behavior="height" /> : null
                    }
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    imageBkg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
    },
    title: {
        alignItems: 'center',
        fontSize: 45,
        fontWeight: "600",
        color: '#FFFFFF',
        marginTop: 75
    },
    interactionsContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '44%',
        width: '88%',
        marginBottom: 10
    },
    inputIconBox: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
        borderWidth: 2,
        borderColor: '#757083',
        borderStyle: 'solid',
        marginBottom: 30,
        marginTop: 30,
        padding: 10,
        width: '88%',
        opacity: 0.5
    },
    nameInput: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083',
    },
    text: {
        fontSize: 16,
        fontWeight: "300",
        color: '#757083'
    },
    colorSelectionBox: {
        marginLeft: 10
    },
    colorSelection: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 15,
        width: "88%"
    },
    colorButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10
    },
    button: {
        alignItems: "center",
        fontSize: 16,
        fontWeight: "600",
        color: '#FFFFFF',
        backgroundColor: '#757083',
        minWidth: '88%',
        marginBottom: 10,
        padding: 10
    },
});