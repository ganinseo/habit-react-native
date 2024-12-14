import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const CalendarScreen = () => {
  const [images, setImages] = useState({});
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const requestPermissionAndLoadImages = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("권한 거부", "갤러리에 접근할 수 없습니다.");
          return;
        }

        const savedImages = await AsyncStorage.getItem("images");
        if (savedImages) {
          setImages(JSON.parse(savedImages));
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    requestPermissionAndLoadImages();
  }, []);

  const onDayPress = async (day) => {
    if (day.dateString !== today) {
      Alert.alert("알림", "이미지는 오늘 날짜에만 추가할 수 있습니다.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const updatedImages = {
          ...images,
          [day.dateString]: imageUri,
        };
        setImages(updatedImages);

        await AsyncStorage.setItem("images", JSON.stringify(updatedImages));
        Alert.alert("성공", "이미지가 추가되었습니다.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("오류", "이미지를 추가할 수 없습니다.");
    }
  };

  const renderDay = (dateString) => {
    return images[dateString] ? (
      <Image source={{ uri: images[dateString] }} style={styles.dayImage} />
    ) : null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>12월</Text>
      <Text style={styles.subtitle}>이미지 캘린더</Text>
      <Calendar
        current={today}
        onDayPress={onDayPress}
        markedDates={{
          [today]: { selected: true, marked: true, selectedColor: "#DCDFFF" },
        }}
        dayComponent={({ date, state }) => (
          <TouchableOpacity
            style={[
              styles.dayContainer,
              state === "disabled" && styles.disabledContainer,
            ]}
            onPress={() => onDayPress(date)}
          >
            <Text
              style={[
                styles.dayText,
                state === "disabled" ? styles.disabledText : null,
              ]}
            >
              {date.day}
            </Text>
            {renderDay(date.dateString)}
          </TouchableOpacity>
        )}
        theme={{
          calendarBackground: "#FFFFFF",
          textSectionTitleColor: "#000",
          selectedDayBackgroundColor: "#DCDFFF",
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: "#DCDFFF",
          dayTextColor: "#000",
          textDisabledColor: "#d9d9d9",
          arrowColor: "#DCDFFF",
          monthTextColor: "#000",
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
  },
  calendar: {
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    margin: 4,
    borderRadius: 4,
    backgroundColor: "#FFF",
  },
  disabledContainer: {
    backgroundColor: "#F0F0F0",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledText: {
    color: "#d9d9d9",
  },
  dayImage: {
    width: 40,
    height: 40,
    marginTop: 4,
    borderRadius: 4,
  },
});

export default CalendarScreen;