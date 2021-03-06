import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require("firebase");
require("firebase/firestore");

/**
*@requires react
*@requires prop-types
*@requires react-native
*@requires firebase
*@requires firebase/firestore
*@requires expo-permissions
*@requires expo-image-picker
*@requires expo-location
*/
export default class CustomActions extends React.Component {
  /**
* uploads an image to cloud storage
* @function uploadImageFetch
*/
  uploadImageFetch = async uri => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const imageNameBefore = uri.split("/");
      const imageName = imageNameBefore[imageNameBefore.length - 1];

      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageName}`);

      const snapshot = await ref.put(blob);

      blob.close();

      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.log(error);
    }
  };

  /**
* allows users to pick an image from camera roll storage to send
*@function pickImage
*/
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }
  /**
   * allows user to take a photo to send
   * @function takePhoto
   */
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
      }).catch(error => console.log(error));
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  /**
   * allows user to send the devices location
   * @function getLocation
   */
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        this.props.onSend({ location: result });
      }
    }
  }

  /**
   * depending on the pressen action calls pickImage, takePhoto, or getLocation
   * @function onActionPress
   */
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessibilityLabel="Send Images or your location"
        accessibilityHint="Opens the options to send an image from your camera or library, or your location"
        style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};