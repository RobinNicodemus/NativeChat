# React Native Chat App

This project was build using `react-native` and `expo`.

## Installing the required Libraries

Install dependencies with 

`npm i`

Run local version with 

`expo start`

If you do not have the expo-client installed, install it by running 

`npm install expo-cli -g`

## Run the App

`expo start` will build the app and serve it on localhost. To run the app follow the instructions in the console. Your options include

* Running the App on a physical device:
  * scan the QR-Code in the console with a smartphone that has the expo app installed
  * be sure to use the same network and router as expo

* Running the App on an Android emulator
  * you need to have an Android Emulator running beforehand
  * either press `a` in the console or
  * click "run with Android Emulator" in the expo browser tab



## Dependecies
  
    @react-native-community/masked-view": "0.1.10",
    "@react-native-community/netinfo": "^5.9.6",
    "@react-navigation/native": "^5.7.3",
    "@react-navigation/stack": "^5.9.0",
    "expo": "~38.0.8",
    "expo-image-picker": "~8.3.0",
    "expo-location": "~8.2.1",
    "expo-permissions": "~9.0.1",
    "expo-status-bar": "^1.0.2",
    "firebase": "^7.9.0",
    "react": "~16.11.0",
    "react-dom": "~16.11.0",
    "react-native": "https://github.com/expo/react-native/archive/sdk-38.0.2.tar.gz",
    "react-native-gesture-handler": "~1.6.0",
    "react-native-gifted-chat": "^0.16.3",
    "react-native-maps": "0.27.1",
    "react-native-reanimated": "~1.9.0",
    "react-native-safe-area-context": "~3.0.7",
    "react-native-screens": "~2.9.0",
    "react-native-web": "~0.11.7",
    "react-navigation": "^4.4.0"

_`react-native-gifted-chat` is essential to all functionality of the app_



## Changing the Database to your own

The App is bound to my firebase/firestore databse. If you want to have a private chatroom you should include your own database. The easiest way would be to open one on firebase, as you would then only have to change the configuration constant and nothing more in the app. 

_The Database **must** include a collection named `messages`_

Once you set up your Database, change the const `firebaseConfig` in _Chat.js_ to your own credentials. The format sould look similar to:

    const firebaseConfig = {
      apiKey: "AIzaSyBkL8OpX6-Tgi--bYVhBPoNhUjjn4MsrjA",
      authDomain: "chatapp-4922f.firebaseapp.com",
      databaseURL: "https://chatapp-4922f.firebaseio.com",
      projectId: "chatapp-4922f",
      storageBucket: "chatapp-4922f.appspot.com",
      messagingSenderId: "77873006918",
      appId: "1:77873006918:web:e29f193a239382949a3d47"
    };


##### review the production process on my kanban board
[Kanban board] (https://trello.com/b/s7ykDFBp/5-react-native-chat-app)