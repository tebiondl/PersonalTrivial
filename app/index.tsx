import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, Platform, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handlePlay = () => {
    router.push('/play');
  };

  const handleOptions = () => {
    Alert.alert("Options", "Options screen is not implemented yet.");
  };

  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert("Exit", "This feature is not supported on this platform.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivial</Text>
      <TouchableOpacity style={styles.button} onPress={handlePlay}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleOptions}>
        <Text style={styles.buttonText}>Options</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleExit}>
        <Text style={styles.buttonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: 200,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
