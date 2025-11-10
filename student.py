
import asyncio
from bleak import BleakScanner
from datetime import datetime
import os

async def scan_kgrcet_students(duration=20, output_file="attendance_log.txt"):
    """
    Scans for BLE devices whose name starts with 'KGRCET' for the given duration.
    Saves detected devices into the specified file.
    """
    print(f"🔍 Starting BLE scan for {duration} seconds...")
    found_students = {}

    def detection_callback(device, advertisement_data):
        name = device.name or "Unknown"
        if name.startswith("KGRCET") and name not in found_students:
            found_students[name] = device.address
            time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"{time_str}, {name}, {device.address}\n"
            print(f"✅ {name} ({device.address})")

            # Append new student entry
            with open(output_file, "a", encoding="utf-8") as f:
                f.write(log_entry)

    # Ensure directory exists
    os.makedirs(os.path.dirname(output_file) or ".", exist_ok=True)

    scanner = BleakScanner(detection_callback)
    await scanner.start()
    await asyncio.sleep(duration)
    await scanner.stop()

    if found_students:
        print(f"\n🧾 Scan complete. {len(found_students)} student(s) logged in '{output_file}'.")
    else:
        print("\n⚠️ No 'KGRCET' devices detected. Make sure student devices are advertising.")

    return found_students
