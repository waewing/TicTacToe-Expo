import React from 'react';
import { View, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function LiveStream() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Text onPress={requestPermission}>Grant Permission</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing={'front'} />
    </View>
  );
}