"""
Simple Flask server to serve the gold visualization website
This ensures proper CORS handling and file serving
"""

from flask import Flask, send_from_directory, send_file
import os

app = Flask(__name__)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main index.html"""
    return send_file(os.path.join(BASE_DIR, 'index.html'))

@app.route('/<path:path>')
def serve_file(path):
    """Serve any other file from the project directory"""
    return send_from_directory(BASE_DIR, path)

@app.route('/data/<path:filename>')
def serve_data(filename):
    """Serve CSV files from the data directory"""
    return send_from_directory(os.path.join(BASE_DIR, 'data'), filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')
