import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "@/theme/colors";
import { INDIAN_STATES, IndianState } from "@/data/states";
import { useTwinAI } from "@/context/TwinAIContext";
import { useNavigation } from "@react-navigation/native";

// NOTE: This is a lightweight state-grid "map" view, not a full MapLibre GL map.
// Rendering a real interactive GL map with terrain tiles requires a custom native
// build (EAS Build) since Expo Go doesn't support the MapLibre native module out
// of the box. See README "Upgrading to a real MapLibre GL map" for the next step.

export default function MapScreen() {
  const { selectedState, setSelectedState } = useTwinAI();
  const [query, setQuery] = useState("");
  const navigation = useNavigation<any>();

  const filtered = INDIAN_STATES.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (s: IndianState) => {
    setSelectedState(s);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>India \u2014 Select Region</Text>
      <Text style={styles.subtitle}>Live climate twin, state by state</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search state..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.sm }}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl * 2 }}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedState.id;
          return (
            <Pressable
              style={[styles.stateCard, isSelected && styles.stateCardActive]}
              onPress={() => handleSelect(item)}
            >
              <Ionicons
                name="location"
                size={16}
                color={isSelected ? colors.accent : colors.textSecondary}
              />
              <Text style={[styles.stateName, isSelected && { color: colors.accent }]}>{item.name}</Text>
              <Text style={styles.stateCapital}>{item.capital}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "800", marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginBottom: spacing.md },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  stateCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  stateCardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  stateName: { color: colors.textPrimary, fontSize: 14, fontWeight: "700" },
  stateCapital: { color: colors.textSecondary, fontSize: 11 },
});
