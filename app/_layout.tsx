import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { ChildProgressProvider } from '@/hooks/use-child-progress';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ChildProgressProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="alphabet" />
            <Stack.Screen name="phonics" />
            <Stack.Screen name="stories" />
            <Stack.Screen name="typing" />
            <Stack.Screen name="rewards" />
            <Stack.Screen name="parent" />
          </Stack>
        </ChildProgressProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
