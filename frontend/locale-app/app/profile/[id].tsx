import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, colors } from "../../styles/styles";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-300)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("posts");

  // Dummy data for demonstration
  const [posts, setPosts] = useState([
    { id: 1, image: "https://picsum.photos/id/1/200" },
    { id: 2, image: "https://picsum.photos/id/2/200" },
    { id: 3, image: "https://picsum.photos/id/3/200" },
    { id: 4, image: "https://picsum.photos/id/4/200" },
    { id: 5, image: "https://picsum.photos/id/5/200" },
    { id: 6, image: "https://picsum.photos/id/6/200" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await fetch(`https://locale.itzine.ru/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setUser(data);
        else router.replace("/");
      } catch (error) {
        Alert.alert("Ошибка", "Ошибка сети");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const toggleDrawer = () => {
    if (menuOpen) {
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.parallel([
        Animated.timing(drawerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: false,
        })
      ]).start();
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user_id");
    router.replace("/");
  };

  if (loading)
    return (
      <View style={profileStyles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <View style={profileStyles.container}>
      <StatusBar style="light" />
      
      {/* Overlay when drawer is open */}
      {menuOpen && (
        <Animated.View 
          style={[
            profileStyles.overlay,
            { opacity: overlayAnim }
          ]}
          onTouchStart={toggleDrawer}
        />
      )}

      {/* Header */}
      <SafeAreaView style={profileStyles.header}>
        <TouchableOpacity style={profileStyles.hamburgerIcon} onPress={toggleDrawer}>
          <Ionicons name="menu-outline" size={28} color="white" />
        </TouchableOpacity>
        <Text style={profileStyles.headerTitle}>Профиль</Text>
        <TouchableOpacity style={profileStyles.settingsIcon}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView style={profileStyles.scrollView}>
        <View style={profileStyles.profileHeader}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/300" }} 
            style={profileStyles.profileImage} 
          />
          <View style={profileStyles.profileInfo}>
            <Text style={profileStyles.username}>{user?.username || "Пользователь"}</Text>
            <Text style={profileStyles.email}>{user?.email || "email@example.com"}</Text>
            <TouchableOpacity style={profileStyles.editProfileButton}>
              <Text style={profileStyles.editProfileText}>Редактировать профиль</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>42</Text>
            <Text style={profileStyles.statLabel}>Посты</Text>
          </View>
          <View style={profileStyles.statDivider} />
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>128</Text>
            <Text style={profileStyles.statLabel}>Подписчики</Text>
          </View>
          <View style={profileStyles.statDivider} />
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>97</Text>
            <Text style={profileStyles.statLabel}>Подписки</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={profileStyles.tabContainer}>
          <TouchableOpacity 
            style={[
              profileStyles.tab, 
              activeTab === "posts" && profileStyles.activeTab
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <Ionicons 
              name="grid-outline" 
              size={22} 
              color={activeTab === "posts" ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              profileStyles.tab, 
              activeTab === "saved" && profileStyles.activeTab
            ]}
            onPress={() => setActiveTab("saved")}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={22} 
              color={activeTab === "saved" ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              profileStyles.tab, 
              activeTab === "tagged" && profileStyles.activeTab
            ]}
            onPress={() => setActiveTab("tagged")}
          >
            <Ionicons 
              name="pricetag-outline" 
              size={22} 
              color={activeTab === "tagged" ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={profileStyles.postsContainer}>
          {posts.map(post => (
            <TouchableOpacity key={post.id} style={profileStyles.postItem}>
              <Image source={{ uri: post.image }} style={profileStyles.postImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Drawer Menu */}
      <Animated.View style={[profileStyles.drawer, { left: drawerAnim }]}>
        <View style={profileStyles.drawerHeader}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/300" }} 
            style={profileStyles.drawerProfileImage} 
          />
          <View>
            <Text style={profileStyles.drawerUsername}>{user?.username || "Пользователь"}</Text>
            <Text style={profileStyles.drawerEmail}>{user?.email || "email@example.com"}</Text>
          </View>
          <TouchableOpacity style={profileStyles.drawerClose} onPress={toggleDrawer}>
            <Ionicons name="close-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={profileStyles.drawerContent}>
          <TouchableOpacity style={profileStyles.drawerItem}>
            <Ionicons name="person-outline" size={24} color="white" />
            <Text style={profileStyles.drawerItemText}>Профиль</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={profileStyles.drawerItem}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <Text style={profileStyles.drawerItemText}>Уведомления</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={profileStyles.drawerItem}>
            <Ionicons name="bookmark-outline" size={24} color="white" />
            <Text style={profileStyles.drawerItemText}>Сохраненное</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={profileStyles.drawerItem}>
            <Ionicons name="settings-outline" size={24} color="white" />
            <Text style={profileStyles.drawerItemText}>Настройки</Text>
          </TouchableOpacity>
          
          <View style={profileStyles.drawerDivider} />
          
          <TouchableOpacity style={profileStyles.drawerItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
            <Text style={[profileStyles.drawerItemText, { color: colors.error }]}>Выйти</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={profileStyles.drawerVersion}>Версия 0.01</Text>
      </Animated.View>
    </View>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hamburgerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  settingsIcon: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  editProfileButton: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
  },
  editProfileText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: colors.card,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: colors.border,
  },
  tabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  postsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 1,
  },
  postItem: {
    width: (width - 6) / 3,
    height: (width - 6) / 3,
    margin: 1,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: colors.card,
    zIndex: 200,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  drawerUsername: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  drawerEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  drawerClose: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
    marginHorizontal: 20,
  },
  drawerVersion: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

