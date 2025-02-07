import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../themeContext';
import questionsData from '../../data/realquestions.json';
import * as FileSystem from 'expo-file-system';

export default function EditQuestion() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const idString = Array.isArray(id) ? id[0] : id;
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const question = questionsData.find(q => String(q.id) === idString);
    if (question) {
      setQuestionText(question.question);
      setAnswerText(question.answer);
    }
  }, [idString]);

  const saveQuestion = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'realquestions.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(questionsData, null, 2));
      }
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(fileContent);
      const updatedData = data.map((q: { id: string | number; question: string; answer: string; }) => {
        if (String(q.id) === idString) {
          return { ...q, question: questionText, answer: answerText };
        }
        return q;
      });
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData, null, 2));
      router.back();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}> 
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>Back</Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#eee', color: isDarkMode ? '#fff' : '#000' }]}
        value={questionText}
        onChangeText={setQuestionText}
        placeholder="Edit question"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
      />
      <TextInput
        style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#eee', color: isDarkMode ? '#fff' : '#000', marginTop: 16 }]}
        value={answerText}
        onChangeText={setAnswerText}
        placeholder="Edit answer"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
      />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: isDarkMode ? '#555' : '#eee' }]} onPress={saveQuestion}>
        <Text style={[styles.saveButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 18,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  saveButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
  },
}); 