// ✅ NEW import
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPushListeners } from "./src/services/pushNotifications";
import { syncPushTokenToServer } from "./src/utils/pushTokenSync";
import { fetchHrmOverviewRequest } from "./src/store/slices/hrmSlice";

function PushBootstrap() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  // store "tap" that happened when app was killed
  const pendingTapRef = useRef(null);

  const refresh = () => dispatch(fetchHrmOverviewRequest());

  // 1) Register + sync token only when logged in
  useEffect(() => {
    if (!token) return;

    syncPushTokenToServer()
      .then((t) => console.log("✅ Push token synced:", t))
      .catch((e) => console.log("❌ Push sync failed:", e?.message || e));
  }, [token]);

  // 2) Attach listeners (works when app is foreground/background)
  useEffect(() => {
    const unsubscribe = addPushListeners({
      onReceive: () => {
        // ✅ only works when app is running (foreground)
        if (token) refresh();
      },
      onTap: (resp) => {
        // ✅ works when app is background
        // If token not ready yet, store it and replay later
        if (!token) {
          pendingTapRef.current = resp;
          return;
        }
        refresh();
      },
    });

    return unsubscribe;
  }, [token, dispatch]);

  // 3) Handle "app was killed and opened by tapping notification"
  useEffect(() => {
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) pendingTapRef.current = last;

      // If token already available now, process it
      if (token && pendingTapRef.current) {
        refresh();
        pendingTapRef.current = null;
      }
    })();
  }, [token, dispatch]);

  // 4) If token becomes available later, replay stored tap
  useEffect(() => {
    if (token && pendingTapRef.current) {
      refresh();
      pendingTapRef.current = null;
    }
  }, [token, dispatch]);

  return null;
}
