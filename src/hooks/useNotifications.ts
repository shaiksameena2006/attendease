import { useEffect, useState } from "react";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    const initialized = await notificationService.initialize();
    setIsInitialized(initialized);
    
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? "granted" : "denied");
    return granted;
  };

  const showNotification = async (payload: {
    title: string;
    body: string;
    icon?: string;
    data?: any;
  }) => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return;
    }

    await notificationService.showNotification(payload);
  };

  const generateAINotification = async (
    type: "attendance_reminder" | "event_suggestion" | "attendance_insights",
    context: any
  ) => {
    return await notificationService.generateAINotification(type, context);
  };

  const scheduleNotification = async (
    time: Date,
    payload: {
      title: string;
      body: string;
      icon?: string;
      data?: any;
    }
  ) => {
    await notificationService.scheduleNotification(time, payload);
  };

  return {
    permission,
    isInitialized,
    requestPermission,
    showNotification,
    generateAINotification,
    scheduleNotification,
  };
}
