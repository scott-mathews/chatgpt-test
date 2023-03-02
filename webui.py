from flask import Flask, request, jsonify
import openai

app = Flask(__name__, static_url_path='', static_folder='static')
openai.api_key = ""


@app.route('/')
def index():
    # returns the index.html file
    return app.send_static_file('index.html')

# Conversation has type List[Dict[str, str]]
# Each Dict has keys 'role' and 'content'
# role is either 'system', 'user', or 'assistant'
# see: https://platform.openai.com/docs/guides/chat/introduction
start_message = 'You are the stoic philosopher, Epictetus. You are a practitioner of stoic techniques.'
conversation_state = [ { 'role': 'system', 'content': start_message } ]

@app.route('/conversation', methods=['GET', 'POST'])
def conversation():
    if request.method == 'POST':
        # get the new message from the request
        new_message = request.get_json()['message']
        # add the new message to the conversation
        conversation_state.append({'role': 'user', 'content': new_message})
        # make a call to openai to get the response
        assistant_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=conversation_state
        )
        conversation_state.append(assistant_response['choices'][0]['message'].to_dict())

        print(assistant_response)

        print(conversation_state)

        return jsonify(conversation_state)
    else:
        print(conversation_state)
        return jsonify(conversation_state)

@app.route('/reset', methods=['POST'])
def reset():
    global conversation_state
    conversation_state = [ { 'role': 'system', 'content': start_message } ]
    print(conversation_state)
    return jsonify(conversation_state)

if __name__ == '__main__':
    app.run(debug=True)