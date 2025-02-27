import React from 'react';
import { View, Text } from 'react-native';
import ru from "./ru.json";
import en from "./en.json";
import es from "./es.json";

export const translations = { ru, en, es };
export const availableLanguages = Object.keys(translations);

const TranslationsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Translations</Text>
  </View>
);

export default TranslationsScreen;
