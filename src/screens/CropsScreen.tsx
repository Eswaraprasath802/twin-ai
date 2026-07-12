import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/colors";
import { useTwinAI } from "@/context/TwinAIContext";
import { recommendCrops, Season } from "@/data/crops";
import { Card, Badge } from "@/components/UI";

function currentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return "Kharif";
  if (month >= 10 || month <= 2) return "Rabi";
  return "Zaid";
}

export default function CropsScreen() {
  const { selectedState, current, daily, loading } = useTwinAI();
  const season = currentSeason();

  const suitable = useMemo(() => {
    if (!current || daily.length === 0) return [];
    const avgTemp = (current.temperatureC + (daily[0]?.maxTempC ?? current.temperatureC)) / 2;
    const weeklyRain = daily.reduce((s, d) => s + d.precipitationSumMm, 0);
    const estAnnualRain = weeklyRain * 12;
    return recommendCrops(estAnnualRain, avgTemp, season);
  }, [current, daily, season]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl * 2 }}>
      <Text style={styles.title}>Smart Agriculture</Text>
      <Text style={styles.subtitle}>
        {selectedState.name} \u2022 {season} season
      </Text>

      <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
        <Text style={styles.disclaimer}>
          Recommendations are based on current temperature and rainfall trends \u2014 a general estimate, not a
          substitute for a local soil test. Visit your nearest Krishi Vigyan Kendra for tailored advice.
        </Text>
      </Card>

      {!loading && suitable.length === 0 && (
        <Card>
          <Text style={{ color: colors.textSecondary }}>
            No strong crop matches found for current conditions in this season.
          </Text>
        </Card>
      )}

      {suitable.map((crop) => (
        <Card key={crop.id} style={{ marginBottom: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs }}>
            <Text style={styles.cropName}>{crop.name}</Text>
            <Badge text={season} color={colors.accent} />
          </View>
          <View style={styles.row}>
            <Ionicons name="thermometer" size={14} color={colors.textSecondary} />
            <Text style={styles.rowText}>
              Ideal temp: {crop.idealTempC[0]}\u2013{crop.idealTempC[1]}\u00b0C
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="water" size={14} color={colors.textSecondary} />
            <Text style={styles.rowText}>
              Soil: {crop.soilTypes.join(", ")}
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.rowText}>Sowing: {crop.sowingWindow}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="leaf" size={14} color={colors.textSecondary} />
            <Text style={styles.rowText}>Harvest: {crop.harvestWindow}</Text>
          </View>
          <Text style={styles.notes}>{crop.notes}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "800", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  disclaimer: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  cropName: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  rowText: { color: colors.textSecondary, fontSize: 12 },
  notes: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm, fontStyle: "italic" },
});
