from flask import Flask, render_template, jsonify
from flask_cors import CORS
import asyncio
import threading
from bleak import BleakScanner
from datetime import datetime

app = Flask(__name__)
CORS(app)  # ✅ Allows frontend access from port 8080

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

    scanner = BleakScanner(detection_callback)
    await scanner.start()
    await asyncio.sleep(15)
    await scanner.stop()
    print("📄 Scan complete.")

# ---------------- FLASK ROUTES ---------------- #
@app.route("/")
def home():
    return jsonify({"message": "Flask server running successfully!"})

@app.route("/api/start_scan")
def start_scan():
    threading.Thread(target=lambda: asyncio.run(scan_kgrcet_students())).start()
    return jsonify({"status": "Scan started"}), 200

@app.route("/api/get_results")
def get_results():
    return jsonify(found_students)

# ---------------- MAIN ---------------- #
if __name__ == "__main__":
    app.run(debug=True, port=5000)
