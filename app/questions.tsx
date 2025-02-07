import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './themeContext';
import questionsData from '../data/realquestions.json';

export default function Questions() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}> 
      <View style={[styles.headerRow, { marginBottom: 16 }]}>
        <View style={[styles.buttonBox, { backgroundColor: isDarkMode ? '#555' : '#eee' }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonBox, { backgroundColor: isDarkMode ? '#555' : '#eee', marginLeft: 'auto' }]}>
          <TouchableOpacity onPress={() => router.push('/newQuestion')}>
            <Text style={[styles.addButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={[styles.searchBar, { backgroundColor: isDarkMode ? '#555' : '#eee', color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Search questions..."
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
      />
      <ScrollView style={styles.listContainer}>
        {questionsData.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.questionBox, { backgroundColor: isDarkMode ? '#444' : '#f9f9f9' }]} onPress={() => router.push({ pathname: '/editQuestion/[id]', params: { id: String(item.id) } })}>
            <Text style={[styles.questionText, { color: isDarkMode ? '#fff' : '#000' }]}>
              {item.question}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
  },
  addButtonText: {
    fontSize: 18,
  },
  searchBar: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  questionBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
  },
}); 