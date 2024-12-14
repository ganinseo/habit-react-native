import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // Navigation 훅 추가

const MyPageScreen = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation(); // Navigation 객체 가져오기

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNickname(userData.nickname || "");
          setEmail(userData.email || "");
          setBirthdate(userData.birthdate || "");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("오류", "사용자 정보를 불러올 수 없습니다.");
    }
  };

  const handleProfileUpdate = async () => {
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 불일치", "입력한 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
          nickname,
          birthdate,
        });

        Alert.alert("성공", "프로필이 업데이트되었습니다!");

        // 이전 페이지로 돌아가기
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("오류", "프로필을 업데이트할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        style={styles.profileImage}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="이메일"
        value={email}
        editable={false} 
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 입력"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="생년월일 (YYYY.MM.DD)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleProfileUpdate}>
        <Text style={styles.updateButtonText}>프로필 수정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  disabledInput: {
    color: "#999", 
  },
  updateButton: {
    backgroundColor: "#DCDFFF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyPageScreen;