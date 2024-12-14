import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const FriendHabitsScreen = ({ route }) => {
  const [habits, setHabits] = useState([]);
  const { friendId, friendName } = route.params || {}; // 전달받은 친구 정보
  const db = getFirestore();

  const fetchFriendHabits = async () => {
    try {
      if (!friendId) return;

      const habitsSnapshot = await getDocs(collection(db, `users/${friendId}/habits`));
      const habitsList = habitsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHabits(habitsList);
    } catch (error) {
      console.error("Error fetching friend's habits:", error);
    }
  };

  useEffect(() => {
    fetchFriendHabits();
  }, [friendId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{friendName} 의 오늘 해빗</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.habitContainer,
              item.completed ? styles.completedHabit : styles.incompleteHabit,
            ]}
          >
            <Text style={styles.habitText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>오늘의 습관이 없습니다.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
    marginTop: 40,
    padding: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 40,
  },
  habitContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  completedHabit: {
    backgroundColor: "#DCDFFF", // Light purple for completed
  },
  incompleteHabit: {
    backgroundColor: "#E0E0E0", // Gray for incomplete
  },
  habitText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default FriendHabitsScreen;