import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "dayjs/locale/ko";

dayjs.locale("ko");
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const TodayHabitScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);
  const today = dayjs();
  const todayDay = today.format("dd");
  const auth = getAuth();

  const fetchHabits = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 로그인되어 있지 않습니다.");
        return;
      }
      const habitsRef = collection(db, `users/${user.uid}/habits`);
      const querySnapshot = await getDocs(habitsRef);
      const fetchedHabits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHabits(fetchedHabits);
    } catch (error) {
      console.error("습관 데이터를 가져오는 중 오류 발생: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchHabits);
    return unsubscribe;
  }, [navigation]);

  const todayHabits = habits.filter((habit) => {
    const habitStart = dayjs(habit.startDate);
    const habitEnd = habit.endDate ? dayjs(habit.endDate) : null;

    const isWithinDateRange =
      habitStart.isSameOrBefore(today, "day") &&
      (!habitEnd || habitEnd.isSameOrAfter(today, "day"));

    const isRepeatDay =
      Array.isArray(habit.repeat) && habit.repeat.includes(todayDay);

    return isWithinDateRange && isRepeatDay;
  });

  const toggleHabitCompletion = async (habit) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 로그인되어 있지 않습니다.");
        return;
      }

      const updatedHabits = habits.map((h) =>
        h.id === habit.id ? { ...h, completed: !h.completed } : h
      );
      setHabits(updatedHabits);

      const habitRef = doc(db, `users/${user.uid}/habits`, habit.id);
      await updateDoc(habitRef, { completed: !habit.completed });
    } catch (error) {
      console.error("습관 업데이트 중 오류 발생: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.todayText}>오늘은</Text>
          <Text style={styles.dateText}>
            {dayjs().format("MM월 DD일")} {dayjs().format("dd요일")}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <FlatList
          data={todayHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.habitContainer}>
              <Text style={styles.habitText}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleHabitCompletion(item)}>
                <Ionicons
                  name={item.completed ? "checkbox" : "square-outline"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>오늘의 습관이 없습니다.</Text>
          }
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            나의 <Text style={styles.highlight}>해빗</Text>
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddHabit")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#777" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const repeatDays =
              typeof item.repeat === "string" ? item.repeat.split(",") : item.repeat;

            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("EditHabit", { habit: item })}
              >
                <View style={styles.myHabitContainer}>
                  <Text style={styles.habitText}>{item.name}</Text>
                  <Text style={styles.daysText}>{repeatDays.join(", ")}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40, 
    marginBottom: 20, 
  },
  todayLabel: { fontSize: 16, color: "#777", marginBottom: 4 },
  dateContainer: {
    alignItems: "flex-start",
    paddingTop: 8,
  },
  dateText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  dayText: { fontSize: 16, color: "#555" },
  notificationIcon: { position: "absolute", right: 0 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  section: {
    marginBottom: 5,
    paddingTop: 5, 
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#555" },
  highlight: { color: "#7C83FD" },
  habitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E7E9FF",
    borderRadius: 8,
    marginBottom: 8,
  },
  myHabitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  habitText: { fontSize: 16, color: "#333" },
  daysText: { fontSize: 14, color: "#999" },
  addButton: { marginLeft: "auto" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 16 },
});

export default TodayHabitScreen;