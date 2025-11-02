
import asyncio
from bleak import BleakScanner
from datetime import datetime

attendance_file = "attendance_log.txt"

async def scan_kgrcet_students():
    print("🔍 Scanning for student BLE devices (prefix: 'KGRCET')...\n")
    found_students = {}

    def detection_callback(device, advertisement_data):
        name = device.name or "Unknown"

        # Only log devices that start with 'KGRCET'
        if name.startswith("KGRCET") and name not in found_students:
            found_students[name] = True
            time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"{time_str}, {name}, {device.address}\n"

            print(f"✅ {name} ({device.address})")
            with open(attendance_file, "a", encoding="utf-8") as f:
                f.write(log_entry)

    scanner = BleakScanner(detection_callback)
    await scanner.start()
    print("📡 Scanning for 20 seconds... please advertise from student phones.")
    await asyncio.sleep(20)
    await scanner.stop()

    if found_students:
        print(f"\n🧾 Scan complete. {len(found_students)} student(s) logged in '{attendance_file}'.")
    else:
        print("\n⚠️ No 'KGRCET_' student devices detected. Make sure phones are advertising via nRF Connect.")

if __name__ == "__main__":
    asyncio.run(scan_kgrcet_students())