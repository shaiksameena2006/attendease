from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import time
import os

app = Flask(__name__, static_folder="static", template_folder=".")
CORS(app, resources={r"/api/*": {"origins": "*"}})  # ✅ allow frontend requests

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/api/scan', methods=['GET'])
def scan_students():
    # Simulate scanning
    time.sleep(2)
    scanned_students = ["Sameena", "Sumith", "Vivek", "Akhil"]

    # Save to attendance_log.txt
    with open("attendance_log.txt", "a") as f:
        for name in scanned_students:
            f.write(f"{name}\n")

    return jsonify({"students": scanned_students})

@app.route('/api/view_students', methods=['GET'])
def view_students():
    if not os.path.exists("attendance_log.txt"):
        return jsonify({"students": []})
    with open("attendance_log.txt") as f:
        students = [line.strip() for line in f.readlines()]
    return jsonify({"students": students})

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
