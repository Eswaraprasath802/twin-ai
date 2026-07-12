import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/colors";
import { useTwinAI } from "@/context/TwinAIContext";
import { Card, Badge, StatTile } from "@/components/UI";
import { describeWeatherCode } from "@/api/weather";
import { riskLevelColor } from "@/engine/alertEngine";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const { selectedState, current, daily, aqi, alerts, loading, error, refresh } = useTwinAI();
  const navigation = useNavigation<any>();

  const weatherDesc = current ? describeWeatherCode(current.weatherCode) : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl * 2 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>TWIN AI</Text>
          <Text style={styles.tagline}>Digital Twin of India's Climate</Text>
        </View>
        <Pressable style={styles.stateSwitch} onPress={() => navigation.navigate("Map")}>
          <Ionicons name="location" size={14} color={colors.accent} />
          <Text style={styles.stateSwitchText}>{selectedState.name}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </Pressable>
      </View>

      {error && (
        <Card style={{ borderColor: colors.danger, marginBottom: spacing.md }}>
          <Text style={{ color: colors.danger }}>Couldn't load live data: {error}</Text>
        </Card>
      )}

      {current && (
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.weatherRow}>
            <View>
              <Text style={styles.tempValue}>{Math.round(current.temperatureC)}\u00b0C</Text>
              <Text style={styles.weatherLabel}>{weatherDesc?.label}</Text>
              <Text style={styles.feelsLike}>Feels like {Math.round(current.apparentTemperatureC)}\u00b0C</Text>
            </View>
            <Ionicons
              name={(weatherDesc?.icon as any) ?? "partly-sunny"}
              size={56}
              color={colors.accent}
            />
          </View>

          <View style={styles.statsRow}>
            <StatTile label="Humidity" value={`${current.humidityPct}%`} />
            <StatTile label="Wind" value={`${Math.round(current.windSpeedKmh)} km/h`} />
            <StatTile label="Rain chance" value={`${Math.round(current.precipitationProbabilityPct)}%`} />
          </View>

          {aqi && (
            <View style={{ marginTop: spacing.sm }}>
              <Badge
                text={`AQI ${aqi.aqi} \u2014 ${aqi.aqi >= 200 ? "Very Poor" : aqi.aqi >= 100 ? "Moderate" : "Good"}`}
                color={aqi.aqi >= 200 ? colors.danger : aqi.aqi >= 100 ? colors.warning : colors.success}
              />
            </View>
          )}
        </Card>
      )}

      <Text style={styles.sectionTitle}>Smart Alerts</Text>
      {alerts.length === 0 && !loading && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.textSecondary }}>No active risk alerts for {selectedState.name} right now.</Text>
        </Card>
      )}
      {alerts.map((alert) => (
        <Card key={alert.id} style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Badge text={alert.level.toUpperCase()} color={riskLevelColor(alert.level)} />
          </View>
          <Text style={styles.alertSummary}>{alert.summary}</Text>
          {alert.recommendations.slice(0, 3).map((r, i) => (
            <View key={i} style={styles.recoRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
              <Text style={styles.recoText}>{r}</Text>
            </View>
          ))}
        </Card>
      ))}

      <Text style={styles.sectionTitle}>7-Day Outlook</Text>
      <Card>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daily.map((d) => {
            const desc = describeWeatherCode(d.weatherCode);
            const date = new Date(d.date);
            return (
              <View key={d.date} style={styles.dayTile}>
                <Text style={styles.dayLabel}>
                  {date.toLocaleDateString("en-IN", { weekday: "short" })}
                </Text>
                <Ionicons name={(desc.icon as any) ?? "partly-sunny"} size={22} color={colors.accent} />
                <Text style={styles.dayTemp}>
                  {Math.round(d.maxTempC)}\u00b0/{Math.round(d.minTempC)}\u00b0
                </Text>
                <Text style={styles.dayRain}>{Math.round(d.precipitationProbabilityMaxPct)}%</Text>
              </View>
            );
          })}
        </ScrollView>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  brand: { color: colors.textPrimary, fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  tagline: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  stateSwitch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stateSwitchText: { color: colors.textPrimary, fontSize: 12, fontWeight: "600" },
  weatherRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tempValue: { color: colors.textPrimary, fontSize: 40, fontWeight: "800" },
  weatherLabel: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  feelsLike: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginTop: spacing.lg, marginBottom: spacing.sm },
  alertTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: "700", flex: 1, paddingRight: spacing.sm },
  alertSummary: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.xs },
  recoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  recoText: { color: colors.textSecondary, fontSize: 12, flex: 1 },
  dayTile: { alignItems: "center", width: 64, gap: 4 },
  dayLabel: { color: colors.textSecondary, fontSize: 11 },
  dayTemp: { color: colors.textPrimary, fontSize: 12, fontWeight: "600" },
  dayRain: { color: colors.accent, fontSize: 11 },
});
