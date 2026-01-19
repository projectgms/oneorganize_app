import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAppData } from "../../context/AppDataContext";

const GANTT_URL =
  process.env.EXPO_PUBLIC_GANTT_URL || "http://YOUR_LAN_IP:5173";

export default function GanttScreen() {
  const webRef = useRef(null);
  const { projects } = useAppData();

  const ganttPayload = useMemo(() => {
    // Dummy mapping: projects -> tasks
    const base = new Date(2026, 0, 15); // Jan 15, 2026

    const tasks = [
      {
        id: 100,
        text: "All Projects",
        start: new Date(2026, 0, 15).toISOString(),
        end: new Date(2026, 1, 15).toISOString(),
        progress: 0,
        type: "summary",
        parent: 0,
      },
      ...projects.map((p, i) => {
        const start = new Date(base);
        start.setDate(base.getDate() + i * 3);

        const end = new Date(start);
        end.setDate(start.getDate() + 10 + i * 4);

        return {
          id: i + 1,
          text: p.name,
          start: start.toISOString(),
          end: end.toISOString(),
          duration: 1,
          progress: p.progress ?? 0,
          type: "task",
          parent: 100,
          lazy: false,
        };
      }),
    ];

    const links =
      tasks.length >= 4
        ? [{ id: 1, source: 1, target: 2, type: "e2e" }]
        : [];

    return { tasks, links };
  }, [projects]);

  const onMessage = (e) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg?.type === "ready") {
        webRef.current?.postMessage(
          JSON.stringify({ type: "setData", payload: ganttPayload })
        );
      }
    } catch {}
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        source={{ uri: GANTT_URL }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10, opacity: 0.7 }}>
              Loading Project Gantt…
            </Text>
          </View>
        )}
      />
    </View>
  );
}
