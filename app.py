from flask import Flask, render_template, jsonify
from flask_cors import CORS
import asyncio
import threading
from bleak import BleakScanner
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # ✅ enable frontend requests

attendance_file = "attendance_log.txt"
found_students = {}

# ---------------- BLE SCANNING LOGIC ---------------- #
async def scan_kgrcet_students():
    global found_students
    found_students = {}
    print("🔍 Scanning for student BLE devices (prefix: 'KGRCET')...")

    def detection_callback(device, advertisement_data):
        name = device.name or "Unknown"
        if name.startswith("KGRCET") and name not in found_students:
            found_students[name] = device.address
            time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(attendance_file, "a", encoding="utf-8") as f:
                f.write(f"{time_str}, {name}, {device.address}\n")
            print(f"✅ {name} ({device.address})")

    try:
        scanner = BleakScanner(detection_callback)
        await scanner.start()
        await asyncio.sleep(10)  # ⏱ scan for 10 seconds
        await scanner.stop()
        print("📄 Scan complete.")
    except Exception as e:
        print(f"⚠️ BLE scan failed: {e}")

# ---------------- FLASK ROUTES ---------------- #
@app.route("/")
def home():
    return jsonify({"message": "Flask BLE Attendance API is running ✅"})

@app.route("/start_scan")
def start_scan():
    threading.Thread(target=lambda: asyncio.run(scan_kgrcet_students())).start()
    return jsonify({"status": "Scan started"}), 200

@app.route("/get_results")
def get_results():
    return jsonify(found_students)

# ---------------- MAIN ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # 👈 use 5001 to avoid conflicts
    print(f"🚀 Starting Flask backend on http://127.0.0.1:{port}")
    app.run(debug=True, port=port)
