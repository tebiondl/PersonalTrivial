import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useTheme } from "./themeContext";
import { useNetwork } from './networkContext';
import Constants from 'expo-constants';

export default function NewQuestion() {
  const router = useRouter();
  const { theme } = useTheme();
  const { mode } = useNetwork();
  const isDarkMode = theme === "dark";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const fileUri = FileSystem.documentDirectory + "realquestions.json";
  const { FIREBASE_BASE_URL: baseUrl, API_KEY_FIREBASE: apiKey } = Constants.expoConfig?.extra || {};

  const saveQuestion = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      let questionsArr = [];
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        questionsArr = content ? JSON.parse(content) : [];
      }
      const newId =
        questionsArr.length > 0
          ? Math.max(...questionsArr.map((q: { id: number }) => q.id)) + 1
          : 1;
      const newQuestionObj = { id: newId, question, answer };
      questionsArr.push(newQuestionObj);
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(questionsArr, null, 2)
      );
      if (mode === "online") {
        // Attempt to sync questions online similar to Python script
        const finalData = { questions: questionsArr };
        try {
          const postResponse = await fetch(`${baseUrl}/addQuestions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey
            },
            body: JSON.stringify(finalData)
          });
          if (!postResponse.ok) {
            throw new Error("Failed to sync question online.");
          }
        } catch (postError) {
          console.error("Error syncing question online", postError);
          Alert.alert("Warning", "Question saved locally but failed to sync online.");
        }
      }
      Alert.alert("Success", "Question saved successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save question");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#333" : "#fff" },
      ]}
    >
      <View
        style={[
          styles.buttonBox,
          { backgroundColor: isDarkMode ? "#555" : "#eee" },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={[
              styles.backButtonText,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
        Create a New Question
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#555" : "#eee",
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
        placeholder="Enter your question"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#555" : "#eee",
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
        placeholder="Enter the answer"
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={saveQuestion}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerRow: { flexDirection: "row", marginBottom: 16 },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 18 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  buttonBox: {
    position: 'absolute',
    top: 40,
    left: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 18 },
});
