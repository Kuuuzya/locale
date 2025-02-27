import React, { useState, useEffect, useRef } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { styles, colors } from "../styles/styles";
import { translations, availableLanguages } from "../languages";
import { flags } from "../languages/flags";
import { Background } from "../components/Background";
import LogoSvg from "../assets/logo.svg";
import { StatusBar } from "expo-status-bar";

export default function RegisterScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const router = useRouter();

  const [language, setLanguage] = useState("ru");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Focus states for inputs
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  useEffect(() => {
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

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async () => {
    Keyboard.dismiss();
    setError("");
    
    if (!username || !email || !password || !confirmPassword) {
      setError(translations[language].fillAllFields);
      return;
    }

    if (!isValidEmail(email)) {
      setError(translations[language].invalidEmail);
      return;
    }

    if (password.length < 6) {
      setError(translations[language].passwordMinLength);
      return;
    }
    
    if (password !== confirmPassword) {
      setError(translations[language].passwordsDoNotMatch);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://locale.itzine.ru/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const successMessage = translations[language].accountCreated;
        if (Platform.OS === "web") {
          window.alert(successMessage);
          router.push("/");
        } else {
          Alert.alert(translations[language].success, successMessage, [
            { text: "OK", onPress: () => router.push("/") },
          ]);
        }
      } else {
        const errorMessage = data.detail || translations[language].registrationFailed;
        setError(errorMessage);
      }
    } catch (error) {
      setError(translations[language].networkError);
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Background>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.container, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <LogoSvg width={200} height={100} style={{ marginBottom: 10 }} />
            <Text style={styles.logoText}>{translations[language].registerTitle}</Text>
            <Text style={styles.subtitle}>{translations[language].registerSubtitle}</Text>

            <View style={styles.card}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <TextInput
                placeholder={translations[language].username}
                value={username}
                onChangeText={setUsername}
                style={[styles.input, usernameFocused && styles.inputFocused]}
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
              />
              
              <TextInput
                placeholder={translations[language].email}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, emailFocused && styles.inputFocused]}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              
              <TextInput
                placeholder={translations[language].password}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, passwordFocused && styles.inputFocused]}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              
              <TextInput
                placeholder={translations[language].confirmPassword || "Подтвердите пароль"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={[styles.input, confirmPasswordFocused && styles.inputFocused]}
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!username || !email || !password || !confirmPassword || loading) && 
                  { backgroundColor: colors.border }
                ]}
                onPress={handleRegister}
                disabled={!username || !email || !password || !confirmPassword || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>
                    {translations[language].registerButton}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.bottomLinks}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                  {translations[language].alreadyHaveAccount}
                </Text>
                <Link href="/" asChild>
                  <TouchableOpacity>
                    <Text style={styles.registerText}>
                      {translations[language].loginLink}
                    </Text>
                  </TouchableOpacity>
                </Link>
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
