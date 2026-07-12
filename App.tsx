import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TwinAIProvider } from "@/context/TwinAIContext";
import Navigation from "@/navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <TwinAIProvider>
        <StatusBar style="light" />
        <Navigation />
      </TwinAIProvider>
    </SafeAreaProvider>
  );
}
