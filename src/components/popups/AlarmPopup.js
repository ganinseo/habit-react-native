import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AlarmPopup = ({ onClose, onAlarmSelect }) => {
  const [period, setPeriod] = useState("오전");
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);

  const isComplete = period && hour !== null && minute !== null;

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* 상단 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>알람</Text>
          </View>

          {/* 오전/오후 선택 */}
          <View style={styles.options}>
            {["오전", "오후"].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionButton,
                  period === p && styles.selectedButton,
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text style={styles.optionText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 시(hour) 선택 */}
          <View style={styles.options}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.optionButton,
                  hour === h && styles.selectedButton,
                ]}
                onPress={() => setHour(h)}
              >
                <Text style={styles.optionText}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 분(minute) 선택 */}
          <View style={styles.options}>
            {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.optionButton,
                  minute === m && styles.selectedButton,
                ]}
                onPress={() => setMinute(m)}
              >
                <Text style={styles.optionText}>
                  {m.toString().padStart(2, "0")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 완료 버튼 */}
          <TouchableOpacity
            style={[styles.button, !isComplete && styles.disabledButton]}
            onPress={() => {
              if (isComplete) {
                onAlarmSelect({ period, hour, minute });
                onClose();
              }
            }}
            disabled={!isComplete}
          >
            <Text style={styles.buttonText}>완료</Text>
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
  options: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  optionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 4,
    margin: 4,
    backgroundColor: "#F7F7F7",
  },
  selectedButton: { backgroundColor: "#DCDFFF" },
  optionText: { fontSize: 14 },
  button: {
    backgroundColor: "#DCDFFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#E0E0E0" },
  buttonText: { fontWeight: "bold", color: "black" },
});

export default AlarmPopup;
