import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RepeatPopup = ({ onClose, onRepeatSelect }) => {
  const [repeatType, setRepeatType] = useState("매일");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const renderWeeklyButtons = () => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    return days.map((day) => (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          selectedDays.includes(day) && styles.selectedButton,
        ]}
        onPress={() => toggleSelection(day, selectedDays, setSelectedDays)}
      >
        <Text style={styles.dayText}>{day}</Text>
      </TouchableOpacity>
    ));
  };

  const renderMonthlyButtons = () => {
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);
    return dates.map((date) => (
      <TouchableOpacity
        key={date}
        style={[
          styles.dayButton,
          selectedDates.includes(date) && styles.selectedButton,
        ]}
        onPress={() => toggleSelection(date, selectedDates, setSelectedDates)}
      >
        <Text style={styles.dayText}>{date}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>반복</Text>
          </View>
          {/* 옵션 버튼 */}
          <View style={styles.repeatOptions}>
            <TouchableOpacity onPress={() => setRepeatType("매일")}>
              <Text
                style={
                  repeatType === "매일" ? styles.selectedText : styles.text
                }
              >
                매일
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRepeatType("매주")}>
              <Text
                style={
                  repeatType === "매주" ? styles.selectedText : styles.text
                }
              >
                매주
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRepeatType("매월")}>
              <Text
                style={
                  repeatType === "매월" ? styles.selectedText : styles.text
                }
              >
                매월
              </Text>
            </TouchableOpacity>
          </View>
          {/* 옵션 렌더링 */}
          <View style={styles.optionsContainer}>
            {repeatType === "매주" && renderWeeklyButtons()}
            {repeatType === "매월" && renderMonthlyButtons()}
          </View>
          {/* 완료 버튼 */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              onRepeatSelect(
                repeatType,
                repeatType === "매주" ? selectedDays : selectedDates
              );
              onClose();
            }}
          >
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 24, // 제목과 < 아이콘 간 간격 확보
  },
  repeatOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  text: { fontSize: 16, color: "black" },
  selectedText: { fontSize: 16, fontWeight: "bold", color: "blue" },
  optionsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 16 },
  dayButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 4,
    margin: 4,
    backgroundColor: "#F7F7F7",
  },
  selectedButton: { backgroundColor: "#DCDFFF" },
  dayText: { fontSize: 14 },
  doneButton: {
    backgroundColor: "#DCDFFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  doneText: { fontWeight: "bold", color: "black" },
});

export default RepeatPopup;
