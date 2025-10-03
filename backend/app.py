from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)  # Allow frontend to talk to backend

# Serve React frontend
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# Example API route (future expansion: save/load workouts)
@app.route("/api/hello")
def hello():
    return {"message": "Hello from Flask backend!"}

if __name__ == "__main__":
    app.run(debug=True)
