// src/notifications/setupNotifications.js
import * as Notifications from "expo-notifications";

// This controls how notifications behave when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default Notifications;
