from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

puzzles = [
    {"cipher": "VJKU KU C RTQEGUUKQP", "solution": "THIS IS A PROCESSION"},
    {"cipher": "GUVF VF N GRFG", "solution": "THIS IS A TEST"},
    {"cipher": "WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ", "solution": "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"},
    {"cipher": "YMNX NX F QJXY", "solution": "THIS IS A CODE"}
]

@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

@app.route("/get_puzzle", methods=["GET"])
def get_puzzle():
    puzzle = random.choice(puzzles)
    return jsonify({"cipher": puzzle["cipher"]})

@app.route("/check_solution", methods=["POST"])
def check_solution():
    data = request.json
    user_answer = data.get("solution", "").strip().upper()
    
    for puzzle in puzzles:
        if user_answer == puzzle["solution"]:
            return jsonify({"correct": True, "message": "🎉 Correct! You cracked the code!"})
    
    return jsonify({"correct": False, "message": "❌ Incorrect. Try again!"})

if __name__ == "__main__":
    app.run(debug=True)
    home()