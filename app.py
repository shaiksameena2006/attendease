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
SUPABASE_KEY = "YOUR_KEY_HERE"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------------------
# 🌍 GLOBAL STATE
# -------------------------------
last_results = {}
is_scanning = False


# -------------------------------
# 📄 GOOGLE SHEETS SETUP
# -------------------------------
def get_sheet():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        "attendease.json",
        scope
    )

    client = gspread.authorize(creds)
    sheet = client.open("Copy of Aavishkar 2026").sheet1
    return sheet


# -------------------------------
# 📅 GET TODAY AFTERNOON COLUMN
# -------------------------------
def get_today_afternoon_column(sheet):
    today = datetime.now().strftime("%d-%m-%Y")

    header = sheet.row_values(1)      # Row 1 = Dates
    sub_header = sheet.row_values(2)  # Row 2 = Morning/Afternoon

    for col in range(len(header)):
        if header[col] == today and sub_header[col] == "Afternoon":
            return col + 1

    return None


# -------------------------------
# 🟥 MARK ALL ABSENT
# -------------------------------
def mark_all_absent(sheet, col):
    data = sheet.get_all_records()

    for i in range(len(data)):
        row_number = i + 3  # Data starts from row 3
        sheet.update_cell(row_number, col, "A")

    print("🟥 All students marked ABSENT")


# -------------------------------
# 🟩 MARK PRESENT STUDENTS
# -------------------------------
def mark_present_students(sheet, col, scanned_names):
    data = sheet.get_all_records()

    for i, row in enumerate(data):
        sheet_name = row["Name"]

        for scanned in scanned_names:
            short_name = scanned.replace("KGRCET_", "")

            # TEMP matching logic
            if short_name.lower() in sheet_name.lower():
                row_number = i + 3
                sheet.update_cell(row_number, col, "P")
                print(f"🟩 {sheet_name} marked PRESENT")
                break


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
            # 📄 GOOGLE SHEETS UPDATE
            # -------------------------------
            sheet = get_sheet()

            col = get_today_afternoon_column(sheet)

            if col is None:
                print("❌ Afternoon column for today not found!")
                return

            # Step 1: Mark all absent
            mark_all_absent(sheet, col)

            # Step 2: Mark present
            scanned_names = list(last_results.keys())
            mark_present_students(sheet, col, scanned_names)

            # -------------------------------
            # 💾 OPTIONAL: SUPABASE + TXT LOG
            # -------------------------------
            for student_name in scanned_names:

                # Supabase
                try:
                    data = {
                        "student_id": student_name,
                        "class_id": None,
                        "date": datetime.now().date().isoformat(),
                        "status": "present"
                    }

                    res = supabase.table("attendance_records").insert(data).execute()
                    print("✅ Saved to Supabase")

                except Exception as e:
                    print("❌ Supabase Error:", e)

                # TXT log
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