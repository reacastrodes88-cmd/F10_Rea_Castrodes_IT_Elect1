import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ColorChangerApp() {
  const [bg, setBg] = useState('#FFFFFF'); // default white

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.title}>Color Changer App</Text>

      <View style={styles.row}>
        <Button title="White" onPress={() => setBg('#FFFFFF')} />
        <View style={{ width: 11 }} />
        <Button title="Light Blue" onPress={() => setBg('#DBEAFE')} />
        <View style={{ width: 11 }} />
        <Button title="Light Green" onPress={() => setBg('#DCFCE7')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
});