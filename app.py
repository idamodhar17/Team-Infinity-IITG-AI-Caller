from flask import Flask, request, jsonify
from responses.response_generator import generate_response

app = Flask(__name__)

@app.route('/api/voice-input', methods=['POST'])
def handle_voice_input():
    user_query = request.json.get('text')
    if not user_query:
        return jsonify({"error": "No input provided"}), 400
    
    response = generate_response(user_query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug = True)