import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import questionsData from '../data/realquestions.json';
import { useTheme } from './themeContext';
import { useNetwork } from './networkContext';
import Constants from 'expo-constants';

function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    let temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function PlayScreen() {
  const { mode } = useNetwork();
  const [questionsArr, setQuestionsArr] = useState<{ question: string, answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const { FIREBASE_BASE_URL: baseUrl, API_KEY_FIREBASE: apiKey } = Constants.expoConfig?.extra || {};

  useEffect(() => {
    if (mode === 'online') {
      fetch(`${baseUrl}/getQuestions`, { headers: { 'x-api-key': apiKey } })
        .then(response => {
          if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const questions = data as { question: string, answer: string }[];
          const shuffledQuestions = shuffleArray(questions);
          setQuestionsArr(shuffledQuestions);
          setCurrentIndex(0);
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
          // Fallback to offline questions
          const shuffledQuestions = shuffleArray(questionsData);
          setQuestionsArr(shuffledQuestions);
          setCurrentIndex(0);
        });
    } else {
      const shuffledQuestions = shuffleArray(questionsData);
      setQuestionsArr(shuffledQuestions);
      setCurrentIndex(0);
    }
  }, [mode]);

  const handleNext = () => {
    if (currentIndex < questionsArr.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      Alert.alert("End of Questions", "No more questions available.");
    }
  };

  const currentQuestion = questionsArr[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      {currentQuestion && (
        <>
          <Text style={[styles.questionText, { color: theme === 'dark' ? '#fff' : '#333' }]}>{currentQuestion.question}</Text>
          {showAnswer && (
            <Text style={[styles.answerText, { color: theme === 'dark' ? '#ccc' : 'gray' }]}>{currentQuestion.answer}</Text>
          )}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setShowAnswer(true)}>
        <Text style={styles.buttonText}>Show Answer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next Question</Text>
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
  questionText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  answerText: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
}); 