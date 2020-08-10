import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

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
        }

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
                loggedInText: 'Hello there, ' + this.props.route.params.name + '!'
            });
            this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });

    }

    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribe();
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
            text: message.text,
            createdAt: message.createdAt,
            user: this.state.user
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

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        })),
            setTimeout(() => {
                this.addMessage();
            }, 500);

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
                />
                {
                    Platform.OS === 'android' ?
                        <KeyboardAvoidingView behavior="height" /> : null
                }
            </View >
        )
    }
}
