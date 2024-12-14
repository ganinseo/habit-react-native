module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo', // Expo 프로젝트용 기본 프리셋
        '@babel/preset-react', // React와 JSX 지원 추가
      ],
      plugins: ['react-native-reanimated/plugin'], // React Native Reanimated 지원 추가
    };
  };
  