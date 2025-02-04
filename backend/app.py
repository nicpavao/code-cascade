from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

leaderboard = []  # Temporary in-memory storage (replace with a database later)

@app.route("/")
def home():
    return jsonify({"message": "Backend is running!"})

puzzles = [
    {"cipher": "7 + 3", "solution": "10"},
    {"cipher": "15 - 6", "solution": "9"},
    {"cipher": "8 * 4", "solution": "32"},
    {"cipher": "81 / 9", "solution": "9"},
    {"cipher": "12 + 25", "solution": "37"},
    {"cipher": "100 - 47", "solution": "53"},
    {"cipher": "9 * 7", "solution": "63"},
    {"cipher": "144 / 12", "solution": "12"},
    {"cipher": "18 + 42", "solution": "60"},
    {"cipher": "56 - 19", "solution": "37"}
    ]

@app.route("/get_puzzle", methods=["GET"])
def get_puzzle():
    return jsonify({"cipher": random.choice(puzzles)["cipher"]})

@app.route("/check_solution", methods=["POST"])
def check_solution():
    data = request.json
    user_answer = data.get("solution", "").strip().upper()

    for puzzle in puzzles:
        if user_answer == puzzle["solution"]:
            return jsonify({"correct": True, "message": "🎉 Correct! You cracked the code!"})
    
    return jsonify({"correct": False, "message": "❌ Incorrect. Try again!"})

@app.route("/get_leaderboard", methods=["GET"])
def get_leaderboard():
    return jsonify({"leaderboard": sorted(leaderboard, key=lambda x: x["score"], reverse=True)})

@app.route("/update_leaderboard", methods=["POST"])
def update_leaderboard():
    data = request.json
    name = data.get("name", "Anonymous")
    score = data.get("score", 0)

    existing_user = next((player for player in leaderboard if player["name"] == name), None)
    if existing_user:
        existing_user["score"] = max(existing_user["score"], score)
    else:
        leaderboard.append({"name": name, "score": score})

    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    return jsonify({"message": "Leaderboard updated!", "leaderboard": leaderboard})


if __name__ == "__main__":
    app.run(debug=True)