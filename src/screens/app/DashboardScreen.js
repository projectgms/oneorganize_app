import React, { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text, Button, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchHrmOverviewRequest } from "../../store/slices/hrmSlice";
import { fetchTodayTaskRequest } from "../../store/slices/todaysSlice";
import { getProfileReq } from "../../store/slices/ProfileSlice";
import AvatarRow from "./components/DashboardScreen/AvatarRow";
import CollapsibleSection from "./components/DashboardScreen/CollapsibleSection";
import TaskCard from "./components/DashboardScreen/TaskCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TodayCardSkeleton from "./components/DashboardScreen/Skeletons/TodayCardSkeleton";
import OnLeaveTodaySkeleton from "./components/DashboardScreen/Skeletons/OnLeaveTodaySkeleton";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoTasksCard from "./components/DashboardScreen/NoTasksCard";
import { EmptyPeopleCard } from "./components/DashboardScreen/EmptyPeopleCard";
import { LeaveBalanceCard } from "./components/DashboardScreen/LeaveBalanceCard";

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

  const theme = useTheme();

  const user = useSelector((s) => s.auth.user);
  const isCompanyAdmin = useMemo(() => {
    const roles = user?.roles || [];
    return (
      Array.isArray(roles) &&
      roles.some(
        (r) => String(r).toLowerCase() === "company admin".toLowerCase(),
      )
    );
  }, [user?.roles]);
  const {
    employeeAttendance,
    loading,
    error,
    birthdays,
    joiningAnniversary,
    todaysLeave,
  } = useSelector((s) => s.hrm);

  const { todayTasks, todayTaskLoading } = useSelector((s) => s.todayTasks);

  const { profileLoading } = useSelector((s) => s.profile);

  const apiLoading = profileLoading || loading;

  // console.log("employeeAttendance:",employeeAttendance);

  const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

  const noPeopleUpdates =
    isEmpty(todaysLeave) && isEmpty(birthdays) && isEmpty(joiningAnniversary);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("Screen focused, making API calls");
      dispatch(fetchHrmOverviewRequest());
      dispatch(getProfileReq());
      dispatch(fetchTodayTaskRequest());
    }, [dispatch]),
  );

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
        timeLeftStr: "09:00:00",
        targetOutTime: "",
      };
    }

    const dateLabel = formatDateLabel(a.date);
    const lateSec = hhmmssToSeconds(a.late);
    const breakSec = hhmmssToSeconds(a.total_rest);

    const clockIn = a.clock_in;
    const clockOut = a.clock_out;

    const inSec = hhmmssToSeconds(clockIn);
    const outSec = hhmmssToSeconds(clockOut);

    const targetSec = 9 * 3600;

    let workedSec = 0;

    // compute "current time" in seconds-of-day (your existing real-time notion)
    const now = new Date(nowTs);
    const nowSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // ✅ Worked seconds (same as you had)
    if (clockIn && clockIn !== "00:00:00") {
      if (clockOut && clockOut !== "00:00:00" && outSec > inSec) {
        workedSec = outSec - inSec;
      } else {
        workedSec = Math.max(0, nowSec - inSec);
      }
    }

    // ✅ 9 hours from clock-in (time-of-day target)
    // NOTE: if someone clocks in late night, this can exceed 24h; handle wrap if you want.
    const targetOutSecRaw =
      clockIn && clockIn !== "00:00:00" ? inSec + targetSec : 0;

    const targetOutSec = targetOutSecRaw % (24 * 3600); // wrap to time-of-day
    const targetOutTime =
      clockIn && clockIn !== "00:00:00" ? secondsToHms(targetOutSec) : "";

    // ✅ time left until reaching 9 hours from clock-in
    // if clocked out, compare against clockOut; else compare against now
    const compareSec =
      clockOut && clockOut !== "00:00:00" && outSec > 0 ? outSec : nowSec;

    const elapsedSinceIn =
      clockIn && clockIn !== "00:00:00" ? Math.max(0, compareSec - inSec) : 0;

    const timeLeftSec =
      clockIn && clockIn !== "00:00:00"
        ? Math.max(0, targetSec - elapsedSinceIn)
        : targetSec;

    const progress =
      clockIn && clockIn !== "00:00:00"
        ? Math.min(1, elapsedSinceIn / targetSec)
        : 0;

    const note =
      lateSec > 0 && clockIn && clockIn !== "00:00:00"
        ? `Arrived ${secondsToHms(lateSec)} late at ${clockIn}`
        : clockIn && clockIn !== "00:00:00"
          ? `Clocked in at ${clockIn} • 9h completes at ${targetOutTime}`
          : "Not clocked in yet";

    return {
      dateLabel,
      note,
      workedStr: secondsToHms(workedSec),
      breakStr: secondsToHms(breakSec),
      progress,
      targetLabel: "9:00 hrs",
      timeLeftStr: secondsToHms(timeLeftSec),
      targetOutTime, // <-- "9 hours from clockIn" time-of-day
    };
  }, [employeeAttendance, nowTs]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical:14, paddingBottom: 24 }}>
        {!isCompanyAdmin &&
          (apiLoading ? (
            <TodayCardSkeleton />
          ) : (
            <Card
              style={{
                marginBottom: 12,
                backgroundColor: theme.colors.background,
                elevated: 0,
              }}
            >
              <View style={styles.centeredWrapper}>
                <LeaveBalanceCard available="4" total="15" />
              </View>
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    Today
                  </Text>
                  <Text style={{ color: theme.colors.onSurface }}>
                    {computed.dateLabel}
                  </Text>
                </View>

                <View style={{ height: 10 }} />

                <Text style={{ color: theme.colors.onSurface }}>
                  {loading ? "Loading..." : computed.note}
                </Text>

                {!!error && (
                  <Text style={{ color: "#fb7185", marginTop: 6 }}>
                    Something Went Wrong Please Try Again
                  </Text>
                )}

                <View style={{ height: 16 }} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-in"
                      size={25}
                      color={theme.colors.onSurface}
                    />{" "}
                    {computed.workedStr}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-out"
                      size={25}
                      color={theme.colors.onSurface}
                    />{" "}
                    {computed.breakStr}
                  </Text>
                </View>

                <View style={{ height: 10 }} />

                <ProgressBar progress={computed.progress} />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <Text style={{ color: theme.colors.onSurface }}>0 hrs</Text>
                  <Text style={{ color: theme.colors.onSurface }}>
                    {computed.targetLabel}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}

        <View style={{ paddingVertical: 12 }}>
          {apiLoading ? (
            <OnLeaveTodaySkeleton />
          ) : noPeopleUpdates ? (
            <EmptyPeopleCard
              title="No Updates Today"
              subtitle="No one is on leave, birthday, or work anniversary today."
              imageSource={require("./../../../assets/notification-bell.png")}
            />
          ) : (
            <CollapsibleSection
              collapsedContent={
                <AvatarRow
                  title="On Leave Today"
                  users={todaysLeave}
                  ringColor="#7393B3"
                  fallbackIcon="account-circle"
                />
              }
              badgeTextCollapsed="Today's Birthdays"
              badgeTextCollapsed2="Today's Joining Anniversary"
            >
              <AvatarRow
                title="Birthdays"
                users={birthdays}
                ringColor="#98FB98"
                fallbackIcon="account-circle"
              />

              <AvatarRow
                title="Joining Anniversaries"
                users={joiningAnniversary}
                ringColor="#FFC0CB"
                fallbackIcon="account-circle"
              />
            </CollapsibleSection>
          )}
        </View>

        <View style={{ marginVertical: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginVertical: 12,
              color: theme.colors.onSurface,
              paddingHorizontal: 12,
            }}
          >
            Today's Tasks
          </Text>

          {todayTaskLoading ? (
            <OnLeaveTodaySkeleton />
          ) : todayTasks?.length ? (
            <FlatList
              data={todayTasks}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <TaskCard task={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          ) : (
            <NoTasksCard
              imageSource={require("./../../../assets/empty_tasks.png")}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 4, // Adds a bit of vertical spacing
  },
});
