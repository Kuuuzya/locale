import React from 'react';
import { View, Text } from 'react-native';

export const flags = {
  ru: "🇷🇺",
  en: "🇺🇸",
  es: "🇪🇸"
};

const FlagsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{flags.ru}</Text>
    <Text>{flags.en}</Text>
    <Text>{flags.es}</Text>
  </View>
);

export default FlagsScreen;
