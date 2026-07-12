import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/colors";
import { useTwinAI } from "@/context/TwinAIContext";
import { generateAnswer } from "@/engine/assistantEngine";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Will it rain tomorrow?",
  "Flood probability?",
  "What crop should I grow?",
  "What should I do during heavy rainfall?",
];

export default function ChatScreen() {
  const { selectedState, current, daily, aqi, alerts } = useTwinAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: `Hi, I'm Twin AI \u2014 your climate copilot for ${selectedState.name}. Ask me about weather, rainfall, flood risk, crops, or fertilizer timing.`,
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const send = (text: string) => {
    if (!text.trim() || !current) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    const answer = generateAnswer(text, {
      stateName: selectedState.name,
      current,
      daily,
      aqi: aqi ?? undefined,
      alerts,
    });
    const aiMsg: Message = { id: Date.now().toString() + "-ai", role: "ai", text: answer };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Ionicons name="sparkles" size={18} color={colors.accent} />
        <Text style={styles.headerText}>Twin AI Assistant</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.aiBubble]}>
            <Text style={item.role === "user" ? styles.userText : styles.aiText}>{item.text}</Text>
          </View>
        )}
      />

      {messages.length <= 1 && (
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} style={styles.suggestionChip} onPress={() => send(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask Twin AI..."
          placeholderTextColor={colors.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
        />
        <Pressable style={styles.sendButton} onPress={() => send(input)}>
          <Ionicons name="send" size={18} color={colors.background} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  bubble: { maxWidth: "85%", padding: spacing.md, borderRadius: radius.md },
  userBubble: { backgroundColor: colors.accent, alignSelf: "flex-end", borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: colors.surface, alignSelf: "flex-start", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  userText: { color: colors.background, fontSize: 14, fontWeight: "600" },
  aiText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  suggestions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  suggestionChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  suggestionText: { color: colors.accent, fontSize: 12 },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: colors.accent,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
