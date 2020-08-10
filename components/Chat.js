import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        this.setState({
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
                {
                    _id: 3,
                    text: 'Hello expo!',
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                    },
                },
            ],
        })
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
        }))
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
                    user={{
                        _id: 1,
                    }}
                />
                {
                    Platform.OS === 'android' ?
                        <KeyboardAvoidingView behavior="height" /> : null
                }
            </View >
        )
    }
}
