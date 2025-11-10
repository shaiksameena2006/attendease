from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import asyncio
import os
from datetime import datetime
from student import scan_kgrcet_students  # ✅ BLE scanner function

app = Flask(__name__, static_folder="static", template_folder=".")
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ✅ Directory to store attendance logs by date
ATTENDANCE_DIR = "attendance_logs"
os.makedirs(ATTENDANCE_DIR, exist_ok=True)

def get_today_log_file():
    today = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(ATTENDANCE_DIR, f"attendance_{today}.txt")

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/api/scan", methods=["GET"])
def scan_students():
    try:
        today_file = get_today_log_file()

        # Run scan for 20 seconds and collect names
        students = asyncio.run(scan_kgrcet_students(duration=20, output_file=today_file))

        return jsonify({
            "status": "success",
            "message": f"Scan complete. {len(students)} students detected."
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/view_students", methods=["GET"])
def view_students():
    today_file = get_today_log_file()
    if not os.path.exists(today_file):
        return jsonify({"students": []})

    with open(today_file, "r", encoding="utf-8") as f:
        students = [line.strip() for line in f.readlines()]

    return jsonify({"students": students})

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
