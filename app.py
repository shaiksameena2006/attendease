from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import asyncio
from student import scan_kgrcet_students  # ✅ Import BLE scan function
import os

app = Flask(__name__, static_folder="static", template_folder=".")
CORS(app, resources={r"/api/*": {"origins": "*"}})

attendance_file = "attendance_log.txt"

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/api/scan', methods=['GET'])
def scan_students():
    try:
        # Run the BLE scanning asynchronously
        asyncio.run(scan_kgrcet_students())
        return jsonify({"status": "success", "message": "Scan complete."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/view_students', methods=['GET'])
def view_students():
    if not os.path.exists(attendance_file):
        return jsonify({"students": []})
    with open(attendance_file) as f:
        students = [line.strip() for line in f.readlines()]
    return jsonify({"students": students})

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
