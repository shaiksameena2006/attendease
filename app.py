from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static", template_folder=".")
CORS(app)  # ✅ Allow your React/Next.js frontend to access this API

# ✅ Serve the main HTML file
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# ✅ Optional — serve static files (CSS, JS, etc.)
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

# ✅ NEW: API endpoint to read scanned student data
@app.route("/api/students", methods=["GET"])
def get_students():
    """
    Returns the list of students scanned (from attendance_log.txt)
    """
    file_path = "attendance_log.txt"

    if not os.path.exists(file_path):
        return jsonify({"students": [], "message": "No students found yet."})

    with open(file_path, "r") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    # Optional: reverse to show latest first
    lines.reverse()

    return jsonify({"students": lines})

if __name__ == '__main__':
    # ✅ Run the Flask server
    app.run(debug=True)
