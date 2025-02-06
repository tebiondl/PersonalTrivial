import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import questionsData from '../data/realquestions.json';

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
  const [questionsArr, setQuestionsArr] = useState<{ question: string, answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionsData);
    setQuestionsArr(shuffledQuestions);
    setCurrentIndex(0);
  }, []);

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
    <View style={styles.container}>
      {currentQuestion && (
        <>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {showAnswer && (
            <Text style={styles.answerText}>{currentQuestion.answer}</Text>
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
}); 