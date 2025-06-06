from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")
    language = data.get("language", "english")
    intent = data.get("intent", "general_legal_help")

    # Sample logic (replace with real LLM response)
    response = f"You said: '{prompt}'. I understand you're looking for help with '{intent}'."
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
