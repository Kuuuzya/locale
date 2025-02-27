import { StyleSheet, Platform, Dimensions } from "react-native";
import * as Font from 'expo-font';
const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

export const colors = {
  primary: "#6C63FF", // Современный фиолетовый
  secondary: "#FF6584", // Розовый акцент
  background: "#121212", // Темный фон
  card: "#1E1E1E", // Карточки
  text: "#FFFFFF", // Основной текст
  textSecondary: "#B3B3B3", // Вторичный текст
  border: "#2C2C2C", // Границы
  error: "#FF5252", // Ошибка
  success: "#4CAF50", // Успех
  warning: "#FFC107", // Предупреждение
};

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoText: {
    fontSize: isSmallDevice ? 36 : 42,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),
    lineHeight: 22,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    borderColor: colors.border,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 5,
  },
  forgotText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  registerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
    fontSize: 14,
    alignSelf: "flex-start",
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  languageSwitchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  languageButton: {
    padding: 10,
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
  },
  activeLanguageButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  activeLanguageText: {
    fontWeight: "bold",
    color: colors.text,
  },
  footerLeft: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 15,
    left: 15,
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  footerRight: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 15,
    right: 15,
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  // Новые стили для улучшенного UI
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
    marginVertical: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialButtonText: {
    color: colors.text,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
  orText: {
    color: colors.textSecondary,
    marginVertical: 15,
    fontSize: 16,
    fontFamily: Platform.select({
  web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  ios: 'System',
  default: 'sans-serif',
}),

  },
});
