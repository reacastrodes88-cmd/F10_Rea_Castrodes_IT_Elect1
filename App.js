// App.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Messenger from "./Messenger";
import Komento from "./Komento";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("Messenger");

  return (
    <SafeAreaView style={styles.container}>
      {/* 🧭 Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeScreen === "Messenger" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Messenger")}
        >
          <Text
            style={[
              styles.navText,
              activeScreen === "Messenger" && styles.activeText,
            ]}
          >
            Messenger
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            activeScreen === "Komento" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Komento")}
        >
          <Text
            style={[
              styles.navText,
              activeScreen === "Komento" && styles.activeText,
            ]}
          >
            Comment
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🧩 Screen Content */}
      <View style={styles.screenContainer}>
        {activeScreen === "Messenger" ? <Messenger /> : <Komento />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  activeButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#007AFF",
    backgroundColor: "#eaf3ff",
  },
  activeText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  screenContainer: {
    flex: 1,
  },
});

    
