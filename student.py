
import asyncio
from bleak import BleakScanner

async def scan_kgrcet_students(duration=15):
    print("🔍 Scanning for student BLE devices...")

    found_students = {}

    def detection_callback(device, advertisement_data):
        # Use advertisement data FIRST (most reliable)
        name = advertisement_data.local_name or device.name or "Unknown"

        if name.startswith("KGRCET"):
            found_students[name] = device.address

    scanner = BleakScanner(detection_callback)
    await scanner.start()

    print(f"📡 Scanning for {duration} seconds...")
    await asyncio.sleep(duration)

    await scanner.stop()

    print("✅ Scan finished:", found_students)

    return found_students