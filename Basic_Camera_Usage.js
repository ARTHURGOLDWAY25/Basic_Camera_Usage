import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { Video } from "expo-av"; 

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setRecording] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const camera = useRef();

  //create camera access permission 
  const CameraPermissionAsync = async () => {
    try{
      const {status} = await Permissions.askAsync(Permissions.CAMERA,
      Permissions.AUDIO_RECORDING)
      setHasPermission(status === 'granted')

    } catch (error){
      console.error('Permission failed', error)
    }
  };
// can use the useEffect hook separately
  useEffect(() => {
    CameraPermissionAsync()
  }, [])


  const startRecording = async () => {
    setRecording(true);
    const targetFile = await camera.current.recordAsync();
    setVideoPreviewUrl(targetFile);
  };

  const stopRecording = async () => {
    camera.current.stopRecording();
    setRecording(false);
  };

 if (hasPermission === null) {
  return (
    <View>
      <ActivityIndicator />
      <Text>Loading...</Text>
    </View>
  );
}

 if (hasPermission === false) {
  return (
    <SafeAreaView>
      <View style={{marginTop: 30}}>
        <Text>No access to the camera</Text>
      </View>
    </SafeAreaView>
  );
}

  return (
    <View style={styles.container}>
      {videoPreviewUrl ? (
        <View>
          <Video
            source={videoPreviewUrl}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.videoPreview}
          />
          <Button
            title="Close Preview"
            onPress={() => setVideoPreviewUrl(null)}
          />
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={camera}>
            <View style={styles.buttonContainer}>
              <RecordingButton
                isRecording={isRecording}
                onStartPress={startRecording}
                onStopPress={stopRecording}
              />
            </View>
          </Camera>
        </View>
      )}
    </View>
  );
}

const RecordingButton = ({ isRecording, onStartPress, onStopPress }) => (
  <TouchableOpacity
    onPress={isRecording ? onStopPress : onStartPress}
    style={[
      styles.recordButton,
      isRecording && styles.recordButtonStop,
    ]}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
    aspectRatio: 4/3, // Adjust the aspectRatio to make it horizontal
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D91E18",
    borderWidth: 5,
    borderColor: "white",
  },
  recordButtonStop: {
    backgroundColor: "transparent",
  },
  videoPreview: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 50,
  },
});
