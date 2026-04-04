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
        sheet = client.open("Copy of Aavishkar 2026").sheet1
        return sheet

    except Exception as e:
        print("❌ Sheet connection error:", e)
        return None


# -------------------------------
# 📅 COLUMN FIND
# -------------------------------
def get_today_afternoon_column(sheet):
    try:
        today1 = datetime.now().strftime("%d-%m-%Y")
        today2 = datetime.now().strftime("%-d-%-m-%Y")

        header = sheet.row_values(1)
        sub_header = sheet.row_values(2)

        print("📅 Today formats:", today1, today2)

        for col in range(len(header)):
            if (header[col] == today1 or header[col] == today2) and sub_header[col] == "Afternoon":
                print("✅ Column Found:", col + 1)
                return col + 1

    except Exception as e:
        print("❌ Column detection error:", e)

    return None


# -------------------------------
# 🟥 MARK ABSENT
# -------------------------------
def mark_all_absent(sheet, col):
    try:
        data = sheet.get_all_records()

        for i in range(len(data)):
            row_number = i + 3
            sheet.update_cell(row_number, col, "A")

        print("🟥 All students marked ABSENT")

    except Exception as e:
        print("❌ Error marking absent:", e)


# -------------------------------
# 🟩 MARK PRESENT
# -------------------------------
def mark_present_students(sheet, col, scanned_devices):
    try:
        data = sheet.get_all_records()

        scanned_rolls = []

        for device in scanned_devices:
            if device.startswith("KGRCET_"):
                roll = device.replace("KGRCET_", "").strip().upper()
                scanned_rolls.append(roll)

        print("🎯 Scanned Roll Numbers:", scanned_rolls)

        for i, row in enumerate(data):
            sheet_roll = str(row["Roll No"]).strip().upper()

            if sheet_roll in scanned_rolls:
                row_number = i + 3
                sheet.update_cell(row_number, col, "P")
                print(f"🟩 {sheet_roll} marked PRESENT")

    except Exception as e:
        print("❌ Error marking present:", e)


# -------------------------------
# 🏠 Home
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

            # SAFE SCAN
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

            mark_all_absent(sheet, col)

            scanned_devices = list(last_results.keys())
            mark_present_students(sheet, col, scanned_devices)

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
# RESULTS
# -------------------------------
@app.route('/get_results')
def get_results():
    return jsonify({
        "scanning": is_scanning,
        "results": last_results
    })


@app.route('/scan_status')
def scan_status():
    return jsonify({
        "scanning": is_scanning
    })


# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)