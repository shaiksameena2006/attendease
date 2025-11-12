from flask import Flask, render_template

# Tell Flask exactly where to find the templates
app = Flask(__name__, template_folder="template/templates")

@app.route('/')
def home():
    return render_template('ble_scanner.html')

if __name__ == '__main__':
    app.run(debug=True)
