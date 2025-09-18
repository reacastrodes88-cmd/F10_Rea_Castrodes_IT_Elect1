import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.row}>
        <Button title="increments" onPress={() => setCount(c => c + 1)} />
        <View style={{ width: 11 }} />
        <Button title="decrements" onPress={() => setCount(c => c - 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  count: { fontSize: 48, fontWeight: '700', marginVertical: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
});