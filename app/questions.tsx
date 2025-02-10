import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./themeContext";
import questionsData from "../data/realquestions.json";
import { useNetwork } from "./networkContext";
import Constants from "expo-constants";

export default function Questions() {
  const router = useRouter();
  const { theme } = useTheme();
  const { mode } = useNetwork();
  const isDarkMode = theme === "dark";
  const [searchQuery, setSearchQuery] = React.useState("");

  const { FIREBASE_BASE_URL: baseUrl, API_KEY_FIREBASE: apiKey } =
    Constants.expoConfig?.extra || {};
  const [questions, setQuestions] = React.useState([]);

  const levenshtein = (a: string, b: string): number => {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const matrix = [];
    for (let i = 0; i <= m; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= n; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[m][n];
  };

  React.useEffect(() => {
    async function loadQuestions() {
      if (mode === "online") {
        try {
          const response = await fetch(`${baseUrl}/getQuestions`, { headers: { "x-api-key": apiKey } });
          const data = (await response.json()) as { question: string; answer: string }[];
          console.log("Fetched questions:", data);
          setQuestions(data);
        } catch (error) {
          console.error("Error fetching questions:", error);
          setQuestions(questionsData);
        }
      } else {
        setQuestions(questionsData);
      }
    }
    loadQuestions();
  }, [mode, baseUrl, apiKey]);

  const filteredQuestions = React.useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const queryText = searchQuery.toLowerCase();

    return questions.filter((item) => {
      const questionText = item.question.toLowerCase();

      if (questionText.includes(queryText)) return true;
      const words = questionText.split(/\W+/);
      return words.some((word) => {
        if (!word) return false;
        const wholeSim =
          1 - levenshtein(queryText, word) /
            Math.max(queryText.length, word.length);
        if (wholeSim >= 0.7) return true;
        if (word.length > queryText.length) {
          let bestSim = 0;
          for (let i = 0; i <= word.length - queryText.length; i++) {
            const substring = word.substring(i, i + queryText.length);
            const sim =
              1 - levenshtein(queryText, substring) / queryText.length;
            if (sim >= 0.7) return true;
            bestSim = Math.max(bestSim, sim);
          }
          return bestSim >= 0.7;
        }
        return false;
      });
    });
  }, [questions, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#333" : "#fff" },
      ]}
    >
      <View style={[styles.headerRow, { marginBottom: 16 }]}>
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
        <View
          style={[
            styles.buttonBox,
            {
              backgroundColor: isDarkMode ? "#555" : "#eee",
              marginLeft: "auto",
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.push("/newQuestion")}>
            <Text
              style={[
                styles.addButtonText,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={[
          styles.searchBar,
          {
            backgroundColor: isDarkMode ? "#555" : "#eee",
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
        placeholder="Search questions..."
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <ScrollView style={styles.listContainer}>
        {filteredQuestions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.questionBox,
              { backgroundColor: isDarkMode ? "#444" : "#f9f9f9" },
            ]}
            onPress={() =>
              router.push({
                pathname: "/editQuestion/[id]",
                params: { id: String(item.id) },
              })
            }
          >
            <Text
              style={[
                styles.questionText,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
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
    flexDirection: "row",
    alignItems: "center",
  },
  buttonBox: {
    borderWidth: 1,
    borderColor: "#ccc",
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
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
  },
});
