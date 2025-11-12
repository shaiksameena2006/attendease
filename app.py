from flask import Flask, render_template, jsonify
import asyncio
from student import scan_kgrcet_students

# Path setup (your templates are in templates/templates)
app = Flask(__name__, template_folder="templates/templates")

# Serve the BLE scanner UI
@app.route('/')
@app.route('/scan')
def scan_page():
    return render_template('ble_scanner.html')

# API route for starting the scan
@app.route('/api/start-scan', methods=['POST'])
def start_scan():
    try:
        asyncio.run(scan_kgrcet_students())
        return jsonify({"status": "success", "message": "Scan complete!"})
    except Exception as e:
        print(f"Error during scan: {e}")
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
