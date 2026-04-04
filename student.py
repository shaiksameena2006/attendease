
import asyncio
from bleak import BleakScanner

async def scan_kgrcet_students(duration=15):
    print("🔍 Scanning for student BLE devices...")

    found_students = {}

    def detection_callback(device, advertisement_data):
        try:
            name = advertisement_data.local_name or device.name or "Unknown"

            if name.startswith("KGRCET_"):
                found_students[name] = device.address

        except Exception as e:
            print("⚠️ Detection error:", e)

    try:
        scanner = BleakScanner(detection_callback)

        await scanner.start()
        print(f"📡 Scanning for {duration} seconds...")

        await asyncio.sleep(duration)

        try:
            await scanner.stop()
        except Exception as stop_error:
            print("⚠️ Scanner stop error (ignored):", stop_error)

    except Exception as scan_error:
        print("⚠️ Scan error (ignored):", scan_error)

    print("✅ Scan finished:", found_students)

    return found_students