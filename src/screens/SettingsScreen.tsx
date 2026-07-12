import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/colors";
import { Card } from "@/components/UI";

const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Gujarati", "Punjabi", "Bengali", "Urdu"];

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [celsius, setCelsius] = React.useState(true);
  const [language, setLanguage] = React.useState("English");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl * 2 }}>
      <Text style={styles.title}>Settings</Text>

      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Push notifications for alerts</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.accent, false: colors.border }}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Use Celsius (\u00b0C)</Text>
          <Switch value={celsius} onValueChange={setCelsius} trackColor={{ true: colors.accent, false: colors.border }} />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Language</Text>
      <Card>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang}
              style={[styles.langChip, language === lang && styles.langChipActive]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.langText, language === lang && { color: colors.accent }]}>{lang}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.langNote}>
          Language selection is stored locally for v1. Full in-app translation of AI responses arrives once a
          backend translation service is connected.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>About</Text>
      <Card>
        <View style={styles.row}>
          <Ionicons name="information-circle" size={16} color={colors.accent} />
          <Text style={[styles.rowLabel, { marginLeft: spacing.sm }]}>Twin AI v1.0.0</Text>
        </View>
        <Text style={styles.aboutText}>
          AI-Powered Digital Twin of India's Climate. Weather and air quality data from Open-Meteo. Alerts and
          crop guidance are rule-based; contact your local agriculture/disaster management office for official
          advisories.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "800", marginTop: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.xs },
  rowLabel: { color: colors.textPrimary, fontSize: 14 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  langGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  langChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.surfaceElevated,
  },
  langChipActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  langText: { color: colors.textSecondary, fontSize: 12 },
  langNote: { color: colors.textSecondary, fontSize: 11, marginTop: spacing.sm, lineHeight: 16 },
  aboutText: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm, lineHeight: 18 },
});
