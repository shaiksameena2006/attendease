import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export type RealtimeCallback<T> = (payload: T) => void;

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to attendance updates
  subscribeToAttendance(
    classId: string,
    onUpdate: RealtimeCallback<any>
  ): () => void {
    const channelName = `attendance-${classId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance_records",
          filter: `session_id=eq.${classId}`,
        },
        (payload) => onUpdate(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to timetable changes
  subscribeToTimetable(
    userId: string,
    onUpdate: RealtimeCallback<any>
  ): () => void {
    const channelName = `timetable-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "timetable_entries",
        },
        (payload) => onUpdate(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to event updates
  subscribeToEvents(onUpdate: RealtimeCallback<any>): () => void {
    const channelName = "events";
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        (payload) => onUpdate(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to messages in a conversation
  subscribeToMessages(
    conversationId: string,
    onNewMessage: RealtimeCallback<any>
  ): () => void {
    const channelName = `messages-${conversationId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => onNewMessage(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Subscribe to user presence in a room
  subscribeToPresence(
    roomId: string,
    onPresenceChange: (state: any) => void
  ): () => void {
    const channelName = `presence-${roomId}`;
    
    const channel = supabase
      .channel(channelName)
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        onPresenceChange(state);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  // Track user presence
  async trackPresence(roomId: string, userData: any) {
    const channelName = `presence-${roomId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.track(userData);
    }
  }

  // Unsubscribe from a channel
  private unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
