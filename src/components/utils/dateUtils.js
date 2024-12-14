import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 지원

dayjs.locale("ko");

/**
 * 현재 날짜와 요일을 반환합니다.
 * @returns {string} 오늘 날짜 (예: "2024년 12월 9일 월요일")
 */
export const getToday = () => {
  return dayjs().format("YYYY년 MM월 DD일 dddd");
};

/**
 * 주어진 날짜의 요일을 반환합니다.
 * @param {string} date 날짜 (예: "2024-12-09")
 * @returns {string} 요일 (예: "월요일")
 */
export const getDayOfWeek = (date) => {
  return dayjs(date).format("dddd");
};

/**
 * 날짜를 원하는 포맷으로 변환합니다.
 * @param {string|Date} date 변환할 날짜
 * @param {string} format 포맷 (예: "YYYY-MM-DD")
 * @returns {string} 포맷된 날짜
 */
export const formatDate = (date, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format);
};

/**
 * 날짜가 오늘인지 확인합니다.
 * @param {string} date 확인할 날짜 (예: "2024-12-09")
 * @returns {boolean} true이면 오늘
 */
export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), "day");
};

/**
 * 두 날짜 사이의 차이를 반환합니다.
 * @param {string} date1 첫 번째 날짜
 * @param {string} date2 두 번째 날짜
 * @param {string} unit 비교 단위 (예: "day", "month", "year")
 * @returns {number} 날짜 차이
 */
export const getDateDifference = (date1, date2, unit = "day") => {
  return dayjs(date1).diff(dayjs(date2), unit);
};
