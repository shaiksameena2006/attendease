from flask import Flask, render_template, jsonify
import asyncio
import threading
from student import scan_kgrcet_students
from flask_cors import CORS

app = Flask(__name__, template_folder="templates")
CORS(app)

# Store scan results
last_results = {}
is_scanning = False


@app.route('/')
def home():
    return render_template('ble_scanner.html')


@app.route('/start_scan')
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

            last_results = results if results else {}

            print("✅ Scan completed:", last_results)

        except Exception as e:
            print("❌ Error during scan:", e)
            last_results = {}

        finally:
            is_scanning = False

    # Run scan in background thread
    threading.Thread(target=run_scan).start()

    return jsonify({"status": "started"})


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)