from flask import Flask, request, jsonify
from openai import OpenAI
import random
import string
from collections import defaultdict

app = Flask(__name__)

# OpenAI API Key (replace with your actual key)
OPENAI_API_KEY = "your_openai_api_key"
client = OpenAI(api_key=OPENAI_API_KEY)

# In-memory storage for puzzles, user progress, and game tree
puzzles = {}
user_progress = {}
puzzle_tree = defaultdict(lambda: {"parent": None, "children": []})
scores = defaultdict(lambda: {"solved": 0, "tree_points": 0})

# Function to generate a unique AI-generated word puzzle
def generate_puzzle():
    themes = ["cryptography", "word play", "anagrams", "riddles", "classic ciphers"]
    selected_theme = random.choice(themes)
    
    prompt = f"Generate a simple but clever word puzzle based on {selected_theme}. The puzzle should be solvable within a few minutes but still require some creative thinking."

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": "You are a puzzle generator that provides challenging word puzzles."},
                  {"role": "user", "content": prompt}]
    )
    
    puzzle_text = response.choices[0].message.content
    
    puzzle_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    puzzles[puzzle_id] = {
        "text": puzzle_text,
        "solved": False,
        "creator": None,
        "solvers": []
    }
    return puzzle_id, puzzle_text

@app.route('/start', methods=['POST'])
def start_game():
    user_id = request.json.get("user_id")
    puzzle_id, puzzle_text = generate_puzzle()
    puzzles[puzzle_id]["creator"] = user_id
    user_progress[user_id] = {"puzzle_id": puzzle_id, "shared_with": []}
    
    return jsonify({
        "message": "Your AI-generated puzzle:",
        "puzzle_id": puzzle_id,
        "puzzle_text": puzzle_text,
        "instructions": "Solve this puzzle. If you solve it, you can send new puzzles to 3 friends."
    })

@app.route('/solve', methods=['POST'])
def solve_puzzle():
    user_id = request.json.get("user_id")
    puzzle_id = request.json.get("puzzle_id")
    
    if puzzle_id not in puzzles:
        return jsonify({"error": "Invalid puzzle ID"}), 400
    
    if user_id in puzzles[puzzle_id]["solvers"]:
        return jsonify({"message": "You have already solved this puzzle."})
    
    puzzles[puzzle_id]["solvers"].append(user_id)
    scores[user_id]["solved"] += 2  # 2 points per solved puzzle
    
    return jsonify({
        "message": "Puzzle solved! You can now send new puzzles to 3 friends.",
        "instructions": "Send your unique puzzle links to three friends to continue the chain."
    })

@app.route('/share', methods=['POST'])
def share_puzzle():
    user_id = request.json.get("user_id")
    parent_puzzle_id = request.json.get("puzzle_id")
    
    if user_id not in user_progress or user_progress[user_id]["puzzle_id"] != parent_puzzle_id:
        return jsonify({"error": "Invalid puzzle sharing attempt."}), 400
    
    if len(user_progress[user_id]["shared_with"].append(new_puzzle_id)) >= 3:
        return jsonify({"message": "You have already shared the maximum number of puzzles."})
    
    new_puzzle_id, new_puzzle_text = generate_puzzle()
    puzzle_tree[new_puzzle_id]["parent"] = parent_puzzle_id
    puzzle_tree[parent_puzzle_id]["children"].append(new_puzzle_id)
    user_progress[user_id]["shared_with"].append(new_puzzle_id)
    
    return jsonify({
        "message": "Share this puzzle with a new friend!",
        "puzzle_id": new_puzzle_id,
        "puzzle_text": new_puzzle_text
    })

@app.route('/score', methods=['GET'])
def check_score():
    user_id = request.args.get("user_id")
    
    if user_id not in scores:
        return jsonify({"error": "User not found."}), 400
    
    # Tree points: 1 point per child node in the user's puzzle tree
    tree_points = sum(len(puzzle_tree[p]["children"]) for p in puzzle_tree if puzzles[p]["creator"] == user_id)
    scores[user_id]["tree_points"] = tree_points
    
    return jsonify({
        "solved_puzzles": scores[user_id]["solved"],
        "tree_points": tree_points,
        "total_score": scores[user_id]["solved"] + tree_points
    })

if __name__ == '__main__':
    app.run(debug=True)