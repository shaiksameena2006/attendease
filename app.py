from flask import Flask, jsonify
from flask_cors import CORS
import threading
import asyncio
import random
import time
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

attendance_file = "attendance_log.txt"
found_students = {}

# ---------------- SIMULATED BLE SCANNING ---------------- #
async def simulate_ble_scan():
    global found_students
    found_students = {}
    print("🧠 Simulating BLE scan for student devices...")

    fake_devices = [
        "KGRCET_SAMEENA",
        "KGRCET_SUMITH",
        "KGRCET_VIVEK",
        "KGRCET_SHIVA",
        "KGRCET_OMKAR",
    ]

    for name in fake_devices:
        await asyncio.sleep(random.uniform(1, 3))  # simulate discovery delay
        found_students[name] = f"AA:BB:CC:{random.randint(10,99)}:{random.randint(10,99)}"
        time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(attendance_file, "a", encoding="utf-8") as f:
            f.write(f"{time_str}, {name}, {found_students[name]}\n")
        print(f"✅ Found: {name} ({found_students[name]})")

    print("✅ Simulated scan complete.")

# ---------------- FLASK ROUTES ---------------- #
@app.route("/")
def home():
    return jsonify({"message": "Flask BLE Attendance API running (simulation mode) ✅"})

@app.route("/start_scan")
def start_scan():
    threading.Thread(target=lambda: asyncio.run(simulate_ble_scan())).start()
    return jsonify({"status": "Simulated scan started"}), 200

@app.route("/get_results")
def get_results():
    return jsonify(found_students)

# ---------------- MAIN ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🚀 Flask backend (Simulation Mode) running on http://127.0.0.1:{port}")
    app.run(debug=True, port=port)
