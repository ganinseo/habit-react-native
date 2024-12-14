import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

const StartDatePopup = ({ onClose, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>시작 날짜</Text>
          </View>
          {/* 캘린더 */}
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#DCDFFF",
              },
            }}
            style={styles.calendar}
          />
          {/* 완료 버튼 */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              onDateSelect(selectedDate);
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
  calendar: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  doneButton: {
    width: "100%",
    backgroundColor: "#DCDFFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default StartDatePopup;
