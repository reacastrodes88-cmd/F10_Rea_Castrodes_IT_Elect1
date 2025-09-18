import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState("white");

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Counter App */}
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.row}>
        <Button title="increment" onPress={() => setCount(count + 1)} />
        <Button title="decrement" onPress={() => setCount(count - 1)} />
      </View>

      {/* Color Changer App */}
      <Text style={styles.title}>Color Changer App</Text>
      <View style={styles.row}>
        <Button title="WHITE" onPress={() => setBgColor("white")} />
        <Button title="LIGHT BLUE" onPress={() => setBgColor("lightblue")} />
        <Button title="LIGHT GREEN" onPress={() => setBgColor("lightgreen")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,               // fills the entire screen
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
  },
  count: {
    fontSize: 40,
    margin: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    margin: 10,
  },
});