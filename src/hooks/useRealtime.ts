import { useEffect } from "react";
import { realtimeService, RealtimeCallback } from "@/services/realtimeService";

export function useRealtimeAttendance(
  classId: string,
  onUpdate: RealtimeCallback<any>
) {
  useEffect(() => {
    if (!classId) return;

    const unsubscribe = realtimeService.subscribeToAttendance(classId, onUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [classId, onUpdate]);
}

export function useRealtimeTimetable(
  userId: string,
  onUpdate: RealtimeCallback<any>
) {
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = realtimeService.subscribeToTimetable(userId, onUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [userId, onUpdate]);
}

export function useRealtimeEvents(onUpdate: RealtimeCallback<any>) {
  useEffect(() => {
    const unsubscribe = realtimeService.subscribeToEvents(onUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [onUpdate]);
}

export function useRealtimeMessages(
  conversationId: string,
  onNewMessage: RealtimeCallback<any>
) {
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = realtimeService.subscribeToMessages(
      conversationId,
      onNewMessage
    );
    
    return () => {
      unsubscribe();
    };
  }, [conversationId, onNewMessage]);
}

export function usePresence(
  roomId: string,
  userData: any,
  onPresenceChange: (state: any) => void
) {
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = realtimeService.subscribeToPresence(
      roomId,
      onPresenceChange
    );

    // Track user presence
    realtimeService.trackPresence(roomId, userData);
    
    return () => {
      unsubscribe();
    };
  }, [roomId, userData, onPresenceChange]);
}
