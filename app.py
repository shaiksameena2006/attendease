from flask import Flask, render_template, jsonify
import asyncio
import threading
from flask_cors import CORS
from datetime import datetime

import gspread
from oauth2client.service_account import ServiceAccountCredentials

from student import scan_kgrcet_students


app = Flask(__name__, template_folder="templates")
CORS(app)

# -------------------------------
# 🌍 GLOBAL STATE
# -------------------------------
last_results = {}
is_scanning = False


# -------------------------------
# 📄 GOOGLE SHEETS SETUP
# -------------------------------
def get_sheet():
    try:
        scope = [
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/drive"
        ]

        creds = ServiceAccountCredentials.from_json_keyfile_name(
            "attendease.json",
            scope
        )

        client = gspread.authorize(creds)
        sheet = client.open("attendease")

        return sheet

    except Exception as e:
        print("❌ Sheet connection error:", e)
        return None


# -------------------------------
# 📅 FIND TODAY AFTERNOON COLUMN
# -------------------------------
def get_today_afternoon_column(sheet):
    today = datetime.now().strftime("%d-%m-%Y")

    header = sheet.row_values(1)
    sub_header = sheet.row_values(2)

    print("📅 Header Row:", header)
    print("📅 Sub Header Row:", sub_header)

    last_date = None

    for col in range(len(header)):
        cell_date = header[col].strip()
        cell_time = sub_header[col].strip().lower()

        # Handle merged cells
        if cell_date != "":
            last_date = cell_date

        if last_date == today and cell_time == "afternoon":
            print("✅ Column Found:", col + 1)
            return col + 1

    print("❌ Column NOT found")
    return None


# -------------------------------
# 🚀 FAST ATTENDANCE UPDATE (BATCH)
# -------------------------------
def update_attendance(sheet, col, scanned_devices):
    try:
        data = sheet.get_all_values()

        # Extract roll numbers
        scanned_rolls = []
        for device in scanned_devices:
            if device.startswith("KGRCET_"):
                roll = device.replace("KGRCET_", "").strip().upper()
                scanned_rolls.append(roll)

        print("🎯 Scanned Roll Numbers:", scanned_rolls)

        updates = []

        for i in range(2, len(data)):  # start from row 3
            row = data[i]

            if len(row) < 4:
                continue

            sheet_roll = row[3].strip().upper()
            row_number = i + 1

            # Default = Absent
            value = "A"

            if sheet_roll in scanned_rolls:
                value = "P"
                print(f"🟩 {sheet_roll} marked PRESENT")

            updates.append({
                "range": f"{chr(64 + col)}{row_number}",
                "values": [[value]]
            })

        # SINGLE API CALL
        sheet.batch_update(updates)

        print("🚀 Attendance updated in ONE API call")

    except Exception as e:
        print("❌ Batch update error:", e)


# -------------------------------
# 🏠 HOME PAGE
# -------------------------------
@app.route('/')
def home():
    return render_template('ble_scanner.html')


# -------------------------------
# 📡 START SCAN
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

            try:
                results = asyncio.run(scan_kgrcet_students(duration=15))
            except Exception as e:
                print("⚠️ Scan error:", e)
                results = {}

            last_results = results if isinstance(results, dict) else {}

            print("✅ Scan completed:", last_results)

            # -------------------------------
            # GOOGLE SHEETS
            # -------------------------------
            sheet = get_sheet()

            if not sheet:
                print("❌ Sheet not available")
                return

            col = get_today_afternoon_column(sheet)

            if col is None:
                print("❌ Column not found")
                return

            scanned_devices = list(last_results.keys())

            # 🚀 ONLY THIS (NO OLD FUNCTIONS)
            update_attendance(sheet, col, scanned_devices)

            # -------------------------------
            # TXT LOG
            # -------------------------------
            for device in scanned_devices:
                try:
                    with open("attendance_log.txt", "a") as f:
                        f.write(f"{device} - PRESENT - {datetime.now()}\n")
                except Exception as e:
                    print("❌ TXT error:", e)

        except Exception as e:
            print("❌ FINAL ERROR:", e)

        finally:
            is_scanning = False

    threading.Thread(target=run_scan, daemon=True).start()

    return jsonify({"status": "started"})


# -------------------------------
# 📊 GET RESULTS
# -------------------------------
@app.route('/get_results')
def get_results():
    return jsonify({
        "scanning": is_scanning,
        "results": last_results
    })


# -------------------------------
# 🔄 SCAN STATUS
# -------------------------------
@app.route('/scan_status')
def scan_status():
    return jsonify({
        "scanning": is_scanning
    })


# -------------------------------
# 🚀 RUN SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)