import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 키-값 데이터를 AsyncStorage에 저장합니다.
 * @param {string} key 저장할 키
 * @param {any} value 저장할 값
 * @returns {Promise<void>}
 */
export const saveToStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data to storage (${key}):`, error);
  }
};

/**
 * AsyncStorage에서 데이터를 가져옵니다.
 * @param {string} key 가져올 키
 * @returns {Promise<any>} 저장된 값
 */
export const getFromStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving data from storage (${key}):`, error);
  }
};

/**
 * AsyncStorage에서 특정 키의 데이터를 삭제합니다.
 * @param {string} key 삭제할 키
 * @returns {Promise<void>}
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from storage (${key}):`, error);
  }
};

/**
 * AsyncStorage의 모든 데이터를 삭제합니다.
 * @returns {Promise<void>}
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

/**
 * AsyncStorage에 저장된 모든 키를 반환합니다.
 * @returns {Promise<string[]>} 저장된 모든 키
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error retrieving all keys from storage:", error);
  }
};
