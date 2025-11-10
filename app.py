from flask import Flask, render_template, send_from_directory, jsonify
import time

app = Flask(__name__, static_folder="static", template_folder=".")

# Serve the main HTML file
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# ✅ Simulate scanning BLE devices
@app.route('/api/scan', methods=['GET'])
def scan_students():
    # Simulate delay
    time.sleep(3)
    
    # Fake scanned names
    scanned_students = ["Sameena", "Sumith", "Vivek", "Akhil"]
    
    # Save to text file
    with open("attendance_log.txt", "a") as f:
        for student in scanned_students:
            f.write(f"{student}\n")
    
    return jsonify({"students": scanned_students})

# ✅ View saved students
@app.route('/api/view_students', methods=['GET'])
def view_students():
    try:
        with open("attendance_log.txt", "r") as f:
            lines = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        lines = []
    return jsonify({"students": lines})

# Optional — serve static files
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # ✅ use 5001 to avoid AirPlay conflict
