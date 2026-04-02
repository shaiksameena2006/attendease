from flask import Flask, render_template, jsonify
import asyncio
import threading
from flask_cors import CORS
from student import scan_kgrcet_students

app = Flask(__name__, template_folder="templates")
CORS(app)

# Global state
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
        return jsonify({
            "status": "already_running"
        })

    def run_scan():
        global last_results, is_scanning

        try:
            print("🔍 BLE Scan started...")
            is_scanning = True

            # Run BLE scan properly
            results = asyncio.run(scan_kgrcet_students(duration=15))

            # Ensure valid dictionary
            if isinstance(results, dict):
                last_results = results
            else:
                last_results = {}

            print("✅ Scan completed:", last_results)

        except Exception as e:
            print("❌ Error during scan:", e)
            last_results = {}

        finally:
            is_scanning = False

    # Run in background thread (non-blocking)
    threading.Thread(target=run_scan, daemon=True).start()

    return jsonify({
        "status": "started"
    })


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