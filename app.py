from flask import Flask, render_template, jsonify
import asyncio
import threading
from flask_cors import CORS
from datetime import datetime

# BLE function
from student import scan_kgrcet_students

# Supabase
from supabase import create_client

# OPTIONAL: Google Sheets (comment if not ready)
USE_GOOGLE_SHEETS = False

if USE_GOOGLE_SHEETS:
    import gspread
    from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__, template_folder="templates")
CORS(app)

# -------------------------------
# 🔐 Supabase Config
# -------------------------------
SUPABASE_URL = "YOUR_SUPABASE_URL"
SUPABASE_KEY = "YOUR_SUPABASE_KEY"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------------------
# 📄 Google Sheets Setup (optional)
# -------------------------------
if USE_GOOGLE_SHEETS:
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "credentials.json", scope
    )
    client = gspread.authorize(creds)
    sheet = client.open("Attendance").sheet1

# -------------------------------
# Global state
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

            results = asyncio.run(scan_kgrcet_students(duration=15))

            if isinstance(results, dict):
                last_results = results
                print("🔥 SCAN RESULTS:", results)

                # -------------------------------
                # 💾 SAVE ATTENDANCE
                # -------------------------------
                for student_id, student_name in results.items():

                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                    # ✅ 1. Save to TXT
                    try:
                        with open("attendance_log.txt", "a") as f:
                            f.write(f"{student_name},{student_id},{current_time}\n")
                    except Exception as e:
                        print("❌ TXT ERROR:", e)

                    # ✅ 2. Save to Supabase
                    try:
                        supabase.table("attendance_records").insert({
                            "name": student_name,
                            "roll": student_id,
                            "time": current_time
                        }).execute()
                    except Exception as e:
                        print("❌ SUPABASE ERROR:", e)

                    # ✅ 3. Save to Google Sheets (optional)
                    if USE_GOOGLE_SHEETS:
                        try:
                            sheet.append_row([
                                student_name,
                                student_id,
                                current_time
                            ])
                        except Exception as e:
                            print("❌ SHEETS ERROR:", e)

            else:
                print("⚠️ Invalid results format")
                last_results = {}

        except Exception as e:
            print("❌ SCAN ERROR:", e)
            last_results = {}

        finally:
            is_scanning = False
            print("✅ Scan finished")

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
    app.run(host="0.0.0.0", port=5000, debug=True)