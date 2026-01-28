import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPushListeners } from "../services/pushNotifications";
import { syncPushTokenToServer } from "../utils/pushTokenSync";
import { fetchHrmOverviewRequest } from "../store/slices/hrmSlice";

export default function PushBootstrapper() {
  const dispatch = useDispatch();
  const jwt = useSelector((s) => s.auth.token);

  // store "tap" that happened when app was killed
  const pendingTapRef = useRef(null);

  const refresh = () => dispatch(fetchHrmOverviewRequest());

  // ✅ 1) Register + sync token only when logged in
  useEffect(() => {
    if (!jwt) return;

    syncPushTokenToServer(jwt)
      .then((t) => console.log("✅ Push token synced:", t))
      .catch((e) => console.log("❌ Push sync failed:", e?.message || e));
  }, [jwt]);

  // ✅ 2) Attach listeners (foreground + background tap)
  useEffect(() => {
    const unsubscribe = addPushListeners({
      onReceive: (n) => {
        console.log("🔔 Foreground notification:", n?.request?.content);
        if (jwt) refresh();
      },
      onTap: (resp) => {
        console.log("👉 Notification tapped:", resp?.notification?.request?.content);

        if (!jwt) {
          pendingTapRef.current = resp;
          return;
        }
        refresh();
      },
    });

    return unsubscribe;
  }, [jwt, dispatch]);

  // ✅ 3) Handle “app killed then opened by tapping notification”
  useEffect(() => {
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) pendingTapRef.current = last;

      if (jwt && pendingTapRef.current) {
        refresh();
        pendingTapRef.current = null;
      }
    })();
  }, [jwt, dispatch]);

  // ✅ 4) If jwt becomes available later, replay stored tap
  useEffect(() => {
    if (jwt && pendingTapRef.current) {
      refresh();
      pendingTapRef.current = null;
    }
  }, [jwt, dispatch]);

  return null;
}
