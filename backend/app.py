from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

DATA_FILE = "data.json"

# Helper to load data
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

# Helper to save data
def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# --- API ROUTES ---

@app.route("/api/workouts", methods=["GET"])
def get_workouts():
    data = load_data()
    return jsonify(data)

@app.route("/api/workouts", methods=["POST"])
def save_workouts():
    data = request.json
    save_data(data)
    return jsonify({"status": "ok"})

# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)
