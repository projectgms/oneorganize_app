import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

export default function AvatarRow({
  title = "Also Working",
  users = [],
  ringColor = "#2ECC71",
  fallbackIcon = "account",
}) {
  const theme = useTheme();

  const formatDateLabel = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const d = new Date(`${yyyyMmDd}T00:00:00`);
    if (Number.isNaN(d.getTime())) return yyyyMmDd;
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}{" "}
        <Text style={[styles.count, { color: theme.colors.onSurface }]}>
          ({users?.length})
        </Text>
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item, index) => String(item.id ?? index)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const hasAvatar = !!item?.profile_picture;

          return (
            <View style={styles.userItem}>
              <View style={[styles.avatarRing, { borderColor: ringColor }]}>
                {hasAvatar ? (
                  <Image
                    source={{ uri: item.profile_picture }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.fallback}>
                    <MaterialCommunityIcons
                      name={fallbackIcon}
                      size={36}
                      color="#6B7280"
                    />
                  </View>
                )}
              </View>

              <Text
                style={[styles.name, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {item?.name ?? "Unknown"}
              </Text>

              <Text
                style={[styles.dob, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {formatDateLabel(item?.dob) ?? "Unknown"}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const AVATAR_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    // color: "#111827",
    marginBottom: 10,
  },
  count: {
    fontWeight: "600",
    // color: "#6B7280",
  },
  listContent: {
    paddingRight: 12,
  },
  userItem: {
    width: 78,
    alignItems: "center",
    marginRight: 14,
  },
  avatarRing: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E5E7EB",
  },
  fallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: 6,
    fontSize: 10,
    textAlign: "center",
    color: "#4B5563",
    lineHeight: 14,
  },
  dob: {
    marginTop: 2,
    fontSize: 10,
    textAlign: "center",
    color: "#4B5563",
    lineHeight: 14,
  },
});
