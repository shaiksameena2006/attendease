from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder="static", template_folder=".")

# Serve the main HTML file
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# Optional — serve static files (CSS, JS, etc.)
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True)