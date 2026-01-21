import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CollapsibleSection({
  collapsedContent,
  children,
  defaultExpanded = false,
  badgeTextCollapsed = "Show more",
  badgeTextCollapsed2 = "Show more",
  badgeIcon = "chevron-down",
  badgeIconExpanded = "chevron-up",
  badgeVariant = "soft", // "soft" | "solid"
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const badgeText = badgeTextCollapsed;
  const iconName = badgeIcon;

  const badgeStyle = useMemo(() => {
    return badgeVariant === "solid" ? styles.badgeSolid : styles.badgeSoft;
  }, [badgeVariant]);

  const badgeTextStyle = useMemo(() => {
    return badgeVariant === "solid" ? styles.badgeTextSolid : styles.badgeTextSoft;
  }, [badgeVariant]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={[styles.card, {backgroundColor: "transparent"}]}>
      {/* Top content (always visible) */}
      <View style={styles.top}>
        {collapsedContent}
      </View>

      {/* Hidden / expanded content */}
      {expanded ? <View style={styles.expanded}>{children}</View> : null}

      {/* Bottom badge + arrow */}
      <View style={styles.footer}>
        <Pressable onPress={toggle} style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.85 }]}>
          {!expanded && <>
           <View style={[styles.badge, badgeStyle]}>
            <Text style={[styles.badgeText, badgeTextStyle]}>{badgeText}</Text>
          </View>

          <View style={[styles.badge, badgeStyle]}>
            <Text style={[styles.badgeText, badgeTextStyle]}>{badgeTextCollapsed2}</Text>
          </View>
          </>}

          <View style={styles.arrowBtn}>
            <MaterialCommunityIcons name={expanded ? "chevron-up" : iconName} size={20} color="#111827" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    // backgroundColor: "transperent",
    padding: 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    // elevation: 2,
  },
  top: {
    // your content spacing
  },
  expanded: {
    marginTop: 10,
  },
  footer: {
    marginTop: 4,
    alignItems: "end",
    width: "full",
    justifyContent:"end"
  },
  footerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Badge (chip)
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeSoft: {
    backgroundColor: "#EEF2FF",
  },
  badgeSolid: {
    backgroundColor: "#111827",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextSoft: {
    color: "#3730A3",
  },
  badgeTextSolid: {
    color: "#FFFFFF",
  },

  // Arrow button
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});
