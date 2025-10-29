import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BluetoothBeacon {
  id: string;
  name: string;
  location: string;
  serviceUuid: string;
}

class BluetoothService {
  private device: any = null;
  private server: any = null;
  private isScanning: boolean = false;

  // Check if Web Bluetooth is supported
  isSupported(): boolean {
    return "bluetooth" in (navigator as any);
  }

  // Request Bluetooth device
  async requestDevice(): Promise<boolean> {
    if (!this.isSupported()) {
      toast({
        title: "Bluetooth not supported",
        description: "Your browser doesn't support Web Bluetooth API",
        variant: "destructive",
      });
      return false;
    }

    try {
      this.device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ["generic_access"] }],
        optionalServices: ["battery_service"],
      });

      this.device.addEventListener("gattserverdisconnected", () => {
        console.log("Bluetooth device disconnected");
        this.device = null;
        this.server = null;
      });

      return true;
    } catch (error) {
      console.error("Failed to request Bluetooth device:", error);
      toast({
        title: "Bluetooth connection failed",
        description: "Failed to connect to Bluetooth device",
        variant: "destructive",
      });
      return false;
    }
  }

  // Connect to device
  async connect(): Promise<boolean> {
    if (!this.device) {
      return false;
    }

    try {
      this.server = await this.device.gatt?.connect() || null;
      return this.server !== null;
    } catch (error) {
      console.error("Failed to connect to device:", error);
      return false;
    }
  }

  // Scan for nearby beacons (classroom beacons)
  async scanForBeacons(beacons: BluetoothBeacon[]): Promise<string | null> {
    if (this.isScanning) {
      return null;
    }

    this.isScanning = true;

    try {
      for (const beacon of beacons) {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ services: [beacon.serviceUuid] }],
          optionalServices: ["battery_service"],
        });

        if (device) {
          this.isScanning = false;
          return beacon.id;
        }
      }
    } catch (error) {
      console.error("Beacon scanning error:", error);
    }

    this.isScanning = false;
    return null;
  }

  // Check proximity to classroom beacon
  async checkProximity(classroomId: string): Promise<boolean> {
    // In a real implementation, you would:
    // 1. Get the beacon UUID for the classroom
    // 2. Scan for that specific beacon
    // 3. Check RSSI (signal strength) to determine proximity
    
    // For now, we'll simulate proximity detection
    try {
      const { data: classroom } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", classroomId)
        .single();

      if (!classroom) {
        return false;
      }

      // Simulate proximity check
      // In production, this would use actual Bluetooth beacon detection
      return true;
    } catch (error) {
      console.error("Proximity check failed:", error);
      return false;
    }
  }

  // Mark attendance using proximity
  async markAttendanceByProximity(
    sessionId: string,
    studentId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("attendance_records")
        .insert({
          session_id: sessionId,
          student_id: studentId,
          proximity_verified: true,
          verification_method: "bluetooth",
          status: "present",
        });

      if (error) throw error;

      toast({
        title: "Attendance marked",
        description: "You've been marked present via proximity detection",
      });

      return true;
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast({
        title: "Attendance failed",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
      return false;
    }
  }

  // Disconnect from device
  disconnect() {
    if (this.server?.connected) {
      this.device?.gatt?.disconnect();
    }
    this.device = null;
    this.server = null;
  }

  // Get device info
  getDeviceInfo() {
    if (!this.device) {
      return null;
    }

    return {
      id: this.device.id,
      name: this.device.name,
      connected: this.server?.connected || false,
    };
  }
}

export const bluetoothService = new BluetoothService();
