from flask import Flask, render_template, jsonify
import asyncio
import threading
from flask_cors import CORS
from datetime import datetime

# Supabase
from supabase import Client, create_client

# Google Sheets
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# BLE scanner
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
# 📄 GOOGLE SHEETS FUNCTION
# -------------------------------
def save_to_google_sheets(name):
    try:
        scope = [
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/drive"
        ]

        creds = ServiceAccountCredentials.from_json_keyfile_name(
            "attendease.json",   # your JSON file
            scope
        )

        client = gspread.authorize(creds)

        sheet = client.open("attendease").sheet1

        now = datetime.now()

        sheet.append_row([
            name,
            "present",
            now.strftime("%Y-%m-%d"),
            now.strftime("%H:%M:%S")
        ])

        print("📄 Saved to Google Sheets")

    except Exception as e:
        print("❌ Google Sheets Error:", e)

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
            else:
                last_results = {}

            print("✅ Scan completed:", last_results)

            # -------------------------------
            # 💾 SAVE DATA
            # -------------------------------
            for student_name in last_results.keys():

                # ✅ Supabase (FIXED UUID ISSUE)
                data = {
                    "student_id": student_name,  # ⚠️ using name (temporary)
                    "class_id": None,
                    "date": datetime.now().date().isoformat(),
                    "status": "present"
                }

                try:
                    res = supabase.table("attendance_records").insert(data).execute()
                    print("✅ Saved to Supabase:", res)
                except Exception as e:
                    print("❌ Supabase Error:", e)

                # ✅ Google Sheets
                save_to_google_sheets(student_name)

                # ✅ TXT file
                try:
                    with open("attendance_log.txt", "a") as f:
                        f.write(f"{student_name} - PRESENT - {datetime.now()}\n")
                except Exception as e:
                    print("❌ TXT Error:", e)

        except Exception as e:
            print("❌ Error during scan:", e)
            last_results = {}

        finally:
            is_scanning = False

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