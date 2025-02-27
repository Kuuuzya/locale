import React, { useState, useEffect, useRef } from "react";
import * as Font from 'expo-font';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, colors } from "../styles/styles";
import { translations, availableLanguages } from "../languages";
import { flags } from "../languages/flags";
import { Background } from "../components/Background";
import LogoSvg from "../assets/logo.svg";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const router = useRouter();
  const [language, setLanguage] = useState("ru");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("user_id");
        if (token && userId) {
          console.log("Пользователь уже авторизован, перенаправляем:", userId);
          router.replace(`/profile/${userId}`);
          return;
        }
      } catch (error) {
        console.error("Ошибка проверки авторизации:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();

    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!email || !password) {
      Platform.OS === "web"
        ? window.alert(translations[language].fillAllFields)
        : Alert.alert(translations[language].error, translations[language].fillAllFields);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://locale.itzine.ru/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      const data = await response.json();
      console.log("Ответ API:", data);

      if (response.ok && data.access_token && data.user_id) {
        await AsyncStorage.setItem("token", data.access_token);
        await AsyncStorage.setItem("user_id", String(data.user_id));
        console.log("Авторизация успешна, перенаправляем:", data.user_id);
        router.replace(`/profile/${data.user_id}`);
      } else {
        const errorDetail = data.detail || translations[language].error;
        if (
          errorDetail === "Пользователь не существует" ||
          errorDetail === "User does not exist"
        ) {
          setAuthError(translations[language].userNotFound);
        } else if (
          errorDetail === "Неверный пароль" ||
          errorDetail === "Incorrect password"
        ) {
          setAuthError(translations[language].incorrectPassword);
          setPassword("");
        } else {
          setAuthError(errorDetail);
        }
        Platform.OS === "web"
          ? window.alert(errorDetail)
          : Alert.alert(translations[language].error, errorDetail);
        console.error("Ошибка авторизации:", data);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      Platform.OS === "web"
        ? window.alert(translations[language].networkError)
        : Alert.alert(translations[language].error, translations[language].networkError);
    }
    setLoading(false);
  };

  if (checkingAuth) {
    return (
      <Background>
        <StatusBar style="light" />
              <SafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: "transparent" 
        }} 
        edges={['top', 'left', 'right', 'bottom']}
      >
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Background>
        <StatusBar style="light" />
          <SafeAreaView 
    style={{ 
      flex: 1, 
      backgroundColor: "transparent" 
    }} 
    edges={['top', 'left', 'right', 'bottom']}
  >            <Animated.View 
              style={[
                styles.container, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }
              ]}
            >
            <LogoSvg width={300} height={150} style={{ marginBottom: 10 }} />
            
            <View style={styles.card}>
              <TextInput
                placeholder={translations[language].email}
                value={email}
                onChangeText={(text) => setEmail(text.trim())}
                style={[
                  styles.input, 
                  emailFocused && styles.inputFocused
                ]}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />

              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              <TextInput
                placeholder={translations[language].password}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (authError) setAuthError("");
                }}
                style={[
                  styles.input, 
                  passwordFocused && styles.inputFocused
                ]}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />

              <TouchableOpacity
                style={[styles.loginButton, loading && { backgroundColor: colors.border }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>
                    {translations[language].login}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.bottomLinks}>
                <TouchableOpacity
                  onPress={() => {
                    const message = translations[language].forgot;
                    Platform.OS === "web"
                      ? window.alert(message)
                      : Alert.alert(message);
                  }}
                >
                  <Text style={styles.forgotText}>
                    {translations[language].forgot}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={styles.registerText}>
                    {translations[language].register}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <View style={styles.languageSwitchContainer}>
            {availableLanguages.map((langCode) => (
              <TouchableOpacity
                key={langCode}
                onPress={() => setLanguage(langCode)}
                style={[
                  styles.languageButton,
                  language === langCode && styles.activeLanguageButton,
                ]}
              >
                <Text
                  style={[
                    styles.languageText,
                    language === langCode && styles.activeLanguageText,
                  ]}
                >
                  {flags[langCode] || langCode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerLeft}>
            <TouchableOpacity
              onPress={() => {
                const title = translations[language].aboutProjectTitle;
                const message = translations[language].projectDescription;
                Platform.OS === "web"
                  ? window.alert(`${title}\n\n${message}`)
                  : Alert.alert(title, message);
              }}
            >
              <Text style={styles.footerText}>
                ❓ {translations[language].aboutProjectTitle}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerText}>v 0.01, 2025</Text>
          </View>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
}
