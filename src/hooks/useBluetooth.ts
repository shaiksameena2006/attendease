import { useState } from "react";
import { bluetoothService } from "@/services/bluetoothService";
import { toast } from "@/hooks/use-toast";

export function useBluetooth() {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<any>(null);

  const isSupported = bluetoothService.isSupported();

  const requestDevice = async () => {
    const success = await bluetoothService.requestDevice();
    if (success) {
      const deviceInfo = bluetoothService.getDeviceInfo();
      setDevice(deviceInfo);
    }
    return success;
  };

  const connect = async () => {
    const success = await bluetoothService.connect();
    setIsConnected(success);
    return success;
  };

  const checkProximity = async (classroomId: string) => {
    if (!isSupported) {
      toast({
        title: "Bluetooth not supported",
        description: "Your device doesn't support Bluetooth functionality",
        variant: "destructive",
      });
      return false;
    }

    return await bluetoothService.checkProximity(classroomId);
  };

  const markAttendanceByProximity = async (
    sessionId: string,
    studentId: string
  ) => {
    return await bluetoothService.markAttendanceByProximity(sessionId, studentId);
  };

  const disconnect = () => {
    bluetoothService.disconnect();
    setIsConnected(false);
    setDevice(null);
  };

  return {
    isSupported,
    isConnected,
    device,
    requestDevice,
    connect,
    checkProximity,
    markAttendanceByProximity,
    disconnect,
  };
}
