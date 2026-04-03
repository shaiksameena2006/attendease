from flask import Flask, render_template, jsonify
import asyncio
import threading
from flask_cors import CORS
from datetime import datetime
from supabase import Client, create_client
from student import scan_kgrcet_students

app = Flask(__name__, template_folder="templates")
CORS(app)

# -------------------------------
# 🔑 SUPABASE CONFIG
# -------------------------------
SUPABASE_URL = "https://fvctgxrhvacexqbnvthy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y3RneHJodmFjZXhxYm52dGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTczMjYsImV4cCI6MjA4Nzk5MzMyNn0.LoncwR8EZhE2FnuZcdRmwyIPc03VCVKF-rKFzAbDQPc"

supabase: Client = create_client("https://fvctgxrhvacexqbnvthy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y3RneHJodmFjZXhxYm52dGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MTczMjYsImV4cCI6MjA4Nzk5MzMyNn0.LoncwR8EZhE2FnuZcdRmwyIPc03VCVKF-rKFzAbDQPc")

# -------------------------------
# 🌍 GLOBAL STATE
# -------------------------------
last_results = {}
is_scanning = False

# -------------------------------
# 🏠 Home Page
# -------------------------------
@app.route('/')
def home():
    return render_template('ble_scanner.html')

# -------------------------------
# 📡 Start BLE Scan
# -------------------------------
@app.route('/start_scan', methods=["GET"])
def start_scan():
    global is_scanning

    if is_scanning:
        return jsonify({"status": "already_running"})

    def run_scan():
        global last_results, is_scanning

        try:
            print("🔍 BLE Scan started...")
            is_scanning = True

            # Run BLE scan
            results = asyncio.run(scan_kgrcet_students(duration=15))

            if isinstance(results, dict):
                last_results = results
            else:
                last_results = {}

            print("✅ Scan completed:", last_results)

            # -------------------------------
            # 💾 SAVE TO SUPABASE
            # -------------------------------
            for student_id in last_results.keys():
                data = {
                    "student_id": student_id,
                    "class_id": "your-class-id",  # 🔁 REPLACE THIS
                    "date": datetime.now().date().isoformat(),
                    "status": "present"
                }

                try:
                    res = supabase.table("attendance_records").insert(data).execute()
                    print("✅ Saved to Supabase:", res)
                except Exception as e:
                    print("❌ Supabase Error:", e)

            # -------------------------------
            # 📝 SAVE TO TXT FILE
            # -------------------------------
            with open("attendance_log.txt", "a") as f:
                for student_id in last_results.keys():
                    f.write(f"{student_id} - PRESENT - {datetime.now()}\n")

        except Exception as e:
            print("❌ Error during scan:", e)
            last_results = {}

        finally:
            is_scanning = False

    # Run scan in background
    threading.Thread(target=run_scan, daemon=True).start()

    return jsonify({"status": "started"})

# -------------------------------
# 📊 Get Results
# -------------------------------
@app.route('/get_results', methods=["GET"])
def get_results():
    return jsonify({
        "scanning": is_scanning,
        "results": last_results
    })

# -------------------------------
# 🔄 Scan Status
# -------------------------------
@app.route('/scan_status', methods=["GET"])
def scan_status():
    return jsonify({
        "scanning": is_scanning
    })

# -------------------------------
# 🚀 Run Server
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)