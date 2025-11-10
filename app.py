from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

ATTENDANCE_FILE = "attendance_log.json"

# ✅ Serve your HTML scanning interface
@app.route("/")
def home():
    return send_from_directory(".", "index.html")

# ✅ Simulated BLE scanning function
def perform_ble_scan():
    students = {
        "Sameena": "A1:B2:C3:D4:E5:F6",
        "Sumith": "B1:C2:D3:E4:F5:G6",
        "Vivek": "C1:D2:E3:F4:G5:H6"
    }
    return students

# ✅ Scan and save current attendance
@app.route("/api/scan", methods=["GET"])
def scan_devices():
    students = perform_ble_scan()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data_to_save = {"timestamp": timestamp, "students": students}

    with open(ATTENDANCE_FILE, "w") as f:
        json.dump(data_to_save, f, indent=4)

    return jsonify({"status": "success", "message": "Scan complete", "data": data_to_save})

# ✅ Show latest scanned students
@app.route("/api/view_students", methods=["GET"])
def view_students():
    if not os.path.exists(ATTENDANCE_FILE):
        return jsonify({"error": "No attendance data found"}), 404

    with open(ATTENDANCE_FILE, "r") as f:
        data = json.load(f)

    return jsonify(data)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
