from flask import Flask, render_template, jsonify
import asyncio
from student import scan_kgrcet_students

app = Flask(__name__, template_folder="templates")

# Temporary memory store for scan results
last_results = {}

@app.route('/')
def home():
    return render_template('ble_scanner.html')

@app.route('/start_scan')
def start_scan():
    """Trigger BLE scanning asynchronously."""
    global last_results
    try:
        # Run BLE scan (20 sec)
        last_results = asyncio.run(scan_kgrcet_students(duration=15))
        return jsonify({"status": "success", "message": "Scan completed"})
    except Exception as e:
        print("Error during scan:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get_results')
def get_results():
    return jsonify(last_results)
if __name__ == "__main__":
    app.run(debug=True)