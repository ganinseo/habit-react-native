import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const FriendsScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [qrRef, setQrRef] = useState(null);
  const [friends, setFriends] = useState([]);
  const [nickname, setNickname] = useState("");
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태

  const db = getFirestore();
  const auth = getAuth();

  // Modal Toggle
  const toggleModal = () => setModalVisible(!isModalVisible);

  // Fetch Friends from Firestore
  const fetchFriends = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const friendsSnapshot = await getDocs(collection(db, `users/${user.uid}/friends`));
      const friendsList = friendsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFriends(friendsList);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Fetch Nickname from Firestore
  const fetchNickname = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setNickname(userData.nickname || "닉네임 없음");
      }
    } catch (error) {
      console.error("Error fetching nickname:", error);
      Alert.alert("오류", "닉네임을 불러올 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchNickname();
  }, []);

  // 새로고침 함수
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };

  // Save QR Code
  const saveQrCode = () => {
    if (qrRef) {
      qrRef.toDataURL(async (data) => {
        try {
          const path = `${FileSystem.cacheDirectory}qr_code.png`;
          await FileSystem.writeAsStringAsync(path, data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await Sharing.shareAsync(path, {
            mimeType: "image/png",
            dialogTitle: "QR 코드 공유",
          });

          Alert.alert("성공", "QR 코드가 공유되었습니다!");
        } catch (error) {
          console.error("QR 코드 저장 오류:", error);
          Alert.alert("오류", "QR 코드를 저장할 수 없습니다.");
        }
      });
    }
  };

  // Delete a friend
  const deleteFriend = async (friendId) => {
    Alert.alert(
      "친구 삭제",
      "정말로 이 친구를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              await deleteDoc(doc(db, `users/${user.uid}/friends`, friendId));
              Alert.alert("삭제 완료", "친구가 삭제되었습니다.");
              fetchFriends();
            } catch (error) {
              console.error("Error deleting friend:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* User Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("MyPageScreen")}
        >
          <Image
            source={{ uri: auth.currentUser?.photoURL || "https://via.placeholder.com/50" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>{nickname}</Text>
            <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>친구 목록</Text>
        <TouchableOpacity style={styles.addFriendContainer} onPress={toggleModal}>
          <Text style={styles.addFriendText}>+ 친구 추가 (QR 코드)</Text>
        </TouchableOpacity>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FriendHabitsScreen", {
                  friendId: item.id, // 친구 ID
                  friendName: item.name, // 친구 이름
                })
              }
            >
              <View style={styles.friendCard}>
                <Image source={{ uri: item.photoUrl }} style={styles.friendImage} />
                <Text style={styles.friendName}>{item.name}</Text>
                <TouchableOpacity onPress={() => deleteFriend(item.id)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.friendsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      {/* QR Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>x</Text>
            </TouchableOpacity>
            <QRCode
              value={auth.currentUser?.uid || ""}
              size={200}
              getRef={(ref) => setQrRef(ref)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveQrCode}>
              <Text style={styles.saveButtonText}>QR 이미지 저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#F7F9FC",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  addFriendContainer: {
    marginBottom: 10,
  },
  addFriendText: {
    color: "#ABB2FF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  friendsList: {
    paddingTop: 10,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
    fontSize: 20,
    marginBottom: 20,
    color: "#666",
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#DCDFFF",
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default FriendsScreen;