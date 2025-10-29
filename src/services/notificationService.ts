import { supabase } from "@/integrations/supabase/client";

export type NotificationType = 
  | "attendance_reminder"
  | "timetable_change"
  | "event_registration"
  | "certificate_issued"
  | "message_received"
  | "house_points"
  | "transport_update";

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  async showNotification(payload: NotificationPayload) {
    if (!this.registration) {
      await this.initialize();
    }

    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    try {
      await this.registration?.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/icon-192x192.png",
        badge: payload.badge || "/icon-192x192.png",
        data: payload.data,
        tag: payload.data?.type || "general",
      } as any);
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }

  // Generate AI-powered notification
  async generateAINotification(
    type: "attendance_reminder" | "event_suggestion" | "attendance_insights",
    context: any
  ) {
    try {
      const { data, error } = await supabase.functions.invoke("ai-notifications", {
        body: { type, context },
      });

      if (error) throw error;

      return data.notification;
    } catch (error) {
      console.error("Failed to generate AI notification:", error);
      return null;
    }
  }

  // Schedule notification for class/event
  async scheduleNotification(
    time: Date,
    payload: NotificationPayload
  ) {
    const now = new Date().getTime();
    const scheduledTime = time.getTime();
    const delay = scheduledTime - now;

    if (delay > 0) {
      setTimeout(() => {
        this.showNotification(payload);
      }, delay);
    }
  }

  // Get notification preferences from user profile
  async getNotificationPreferences(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch notification preferences:", error);
      return null;
    }

    return data;
  }
}

export const notificationService = new NotificationService();
