from flask import Flask, jsonify
import asyncio
from student import scan_kgrcet_students

app = Flask(__name__)

# Temporary memory store for scan results
last_results = {}

@app.route('/api/start_scan')
def start_scan():
    global last_results
    try:
        last_results = asyncio.run(scan_kgrcet_students(duration=15))
        return jsonify({"status": "success", "message": "Scan completed"})
    except Exception as e:
        print("Error during scan:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get_results')
def get_results():
    return jsonify(last_results)

if __name__ == "__main__":
    app.run(debug=True)