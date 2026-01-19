import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, ProgressBar, Text, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchHrmOverviewRequest } from "../../store/slices/hrmSlice";

const pad2 = (n) => String(n).padStart(2, "0");

const hhmmssToSeconds = (t = "00:00:00") => {
  if (!t || typeof t !== "string") return 0;
  const [hh, mm, ss] = t.split(":").map((x) => Number(x) || 0);
  return hh * 3600 + mm * 60 + ss;
};

const secondsToHms = (sec = 0) => {
  const s = Math.max(0, Number(sec) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return `${pad2(h)}:${pad2(m)}:${pad2(ss)}`;
};

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

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const { employeeAttendance, loading, error } = useSelector((s) => s.hrm);

  useEffect(() => {
    dispatch(fetchHrmOverviewRequest());
  }, [dispatch]);

  // ✅ timer tick
  const [nowTs, setNowTs] = useState(Date.now());

  useEffect(() => {
    const clockIn = employeeAttendance?.clock_in;
    const clockOut = employeeAttendance?.clock_out;

    const shouldTick =
      clockIn &&
      clockIn !== "00:00:00" &&
      (!clockOut || clockOut === "00:00:00");

    if (!shouldTick) return;

    const id = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [employeeAttendance?.clock_in, employeeAttendance?.clock_out]);

  // ✅ IMPORTANT: add nowTs to dependency so workedStr updates every second
  const computed = useMemo(() => {
    const a = employeeAttendance;

    if (!a) {
      return {
        dateLabel: "",
        note: "",
        workedStr: "00:00:00",
        breakStr: "00:00:00",
        progress: 0,
        targetLabel: "9:00 hrs",
      };
    }

    const dateLabel = formatDateLabel(a.date);
    const lateSec = hhmmssToSeconds(a.late);
    const breakSec = hhmmssToSeconds(a.total_rest);

    const clockIn = a.clock_in;
    const clockOut = a.clock_out;

    const inSec = hhmmssToSeconds(clockIn);
    const outSec = hhmmssToSeconds(clockOut);

    let workedSec = 0;

    if (clockIn && clockIn !== "00:00:00") {
      if (clockOut && clockOut !== "00:00:00" && outSec > inSec) {
        workedSec = outSec - inSec;
      } else {
        const now = new Date(nowTs);
        const nowSec =
          now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        workedSec = Math.max(0, nowSec - inSec);
      }
    }

    const targetSec = 9 * 3600;
    const progress = Math.min(1, workedSec / targetSec);

    const note =
      lateSec > 0 && clockIn && clockIn !== "00:00:00"
        ? `Arrived ${secondsToHms(lateSec)} late at ${clockIn}`
        : clockIn && clockIn !== "00:00:00"
        ? `Clocked in at ${clockIn}`
        : "Not clocked in yet";

    return {
      dateLabel,
      note,
      workedStr: secondsToHms(workedSec),
      breakStr: secondsToHms(breakSec),
      progress,
      targetLabel: "9:00 hrs",
    };
  }, [employeeAttendance, nowTs]); // ✅ FIXED

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Card style={{ marginBottom: 12, backgroundColor: "#0b1220" }}>
        <Card.Content>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Today
            </Text>
            <Text style={{ color: "#cbd5e1" }}>{computed.dateLabel}</Text>
          </View>

          <View style={{ height: 10 }} />

          <Text style={{ color: "#cbd5e1" }}>
            {loading ? "Loading..." : computed.note}
          </Text>

          {!!error && (
            <Text style={{ color: "#fb7185", marginTop: 6 }}>{error}</Text>
          )}

          <View style={{ height: 16 }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
              ⏱ {computed.workedStr}
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 16 }}>
              ☕ {computed.breakStr}
            </Text>
          </View>

          <View style={{ height: 10 }} />

          <ProgressBar progress={computed.progress} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
            <Text style={{ color: "#64748b" }}>0 hrs</Text>
            <Text style={{ color: "#64748b" }}>{computed.targetLabel}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Card.Title
          title={`Hi, ${user?.name ?? "User"} 👋`}
          subtitle="Quick actions"
        />
        <Card.Content>
          <Button mode="contained" onPress={() => navigation.navigate("ApplyLeave")}>
            Apply for Leave
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
 