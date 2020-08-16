import React from 'react';
import { View, Platform, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from "@react-native-community/netinfo";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            loggedInText: "",
            isConnected: false,
            image: null,
            location: null,
        };

        const firebaseConfig = {
            apiKey: "AIzaSyBkL8OpX6-Tgi--bYVhBPoNhUjjn4MsrjA",
            authDomain: "chatapp-4922f.firebaseapp.com",
            databaseURL: "https://chatapp-4922f.firebaseio.com",
            projectId: "chatapp-4922f",
            storageBucket: "chatapp-4922f.appspot.com",
            messagingSenderId: "77873006918",
            appId: "1:77873006918:web:e29f193a239382949a3d47"
        };
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                this.referenceMessages = firebase.firestore().collection('messages');
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }

                    //update user state with currently active user data
                    this.setState({
                        user: {
                            _id: user.uid,
                            name: this.props.route.params.name
                        },
                        loggedInText: 'Hello',
                    });
                    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                });
                //make information available in state
                this.setState({
                    isConnected: true,
                })
            }
            //if not connected:
            else {
                this.getStoredUserId();
                this.getMessages();
            }

        });
    }

    //the typeof checks are necessary to prevent crashing in the case that the app was offline and therefore never was subscribed.
    // saveMessages to save recieved Messages
    componentWillUnmount() {
        this.saveUserId();
        this.saveMessages();
        if (typeof this.authUnsubscribe === "function") { this.authUnsubscribe(); };
        if (typeof this.unsubscribe === "function") { this.unsubscribe(); };
    }


    //get User from asyncStorage, (intended for offline)
    async getStoredUserId() {
        let userId = '';
        try {
            userId = await AsyncStorage.getItem('userId').then(
                this.setState({
                    user: {
                        _id: JSON.parse(userId),
                        name: this.props.route.params.name
                    },
                })
            )
        } catch (error) {
            console.log(error.message)
        }
    }

    async saveUserId() {
        try {
            await AsyncStorage.setItem('userId', JSON.stringify(this.state.user._id));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteStoredUserId() {
        try {
            await AsyncStorage.removeItem('userId');
        } catch (error) {
            console.log(error.message);
        }
    }


    //get Messages from asyncStorage
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'Welcome to the chat!',
                    createdAt: new Date(),
                    system: true,
                },

            ];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message)
        }
    };

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            const data = doc.data();
            // let avatar = (data.user.avatar) ? data.user.avatar : "";
            messages.push({
                _id: data._id,
                text: data.text || "",
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar || "",
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    };
    /*  this.setState({
         messages: [
             {
                 _id: 1,
                 text: 'Hello developer',
                 createdAt: new Date(),
                 user: {
                     _id: 2,
                     name: 'React Native',
                     avatar: 'https://placeimg.com/140/140/any',
                 },
             },
             {
                 _id: 2,
                 text: 'Welcome to the chat, ' + this.props.route.params.name + '!',
                 createdAt: new Date(),
                 system: true,
             },
              'Hello expo!',
                 creat{
                 _id: 3,
                 text:edAt: new Date(),
                 user: {
                     _id: 1,
                 },
             },
         ],
     }) */

    //document _id should be added automatically by firestore
    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || null,
            location: message.location || null
        });
    }


    //allows styling of the speech bubbles, left and right respectively
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    //only render the inputbar when online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.coords.latitude,
                        longitude: currentMessage.location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        //if no location is given return null
        return null
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        })),
            setTimeout(
                () => {
                    this.addMessage();
                    // setTimeout(() => {
                    this.saveMessages();
                    // }, 0);
                }, 0);

    }

    render() {
        //name and color must be passed as props from Start.js
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;

        //sets the title
        this.props.navigation.setOptions({ title: name })


        //return view that spans the viewport, and contains 
        //GiftedChat and
        //a conditional render of the keyboardfix in case of Android OS 
        return (
            <View style={{
                height: '100%', width: '100%',
                backgroundColor: color
            }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                />
                {
                    Platform.OS === 'android' ?
                        <KeyboardAvoidingView behavior="height" /> : null
                }
            </View >
        )
    }
}
