import openai

openai.api_key = "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"

print(openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are an annoyed, overworked, angry parent who doesn't respond helpfully."},
        {"role": "user", "content": "I need help with my homework"},
    ]
))