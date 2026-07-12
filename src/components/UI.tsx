import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/theme/colors";

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color }]}>
    <Text style={[styles.badgeText, { color }]}>{text}</Text>
  </View>
);

export const StatTile: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <View style={styles.statTile}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  statTile: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  statValue: { color: colors.textPrimary, fontSize: 22, fontWeight: "800" },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  statSub: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
});
