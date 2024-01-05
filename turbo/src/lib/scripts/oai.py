from openai import OpenAI
import os

client = OpenAI(api_key=os.environ["OPEN_AI"])

def call_open_ai(prompt, system_prompt, response_format = None):
    kwargs = {
        'model': "gpt-4-1106-preview",
        'temperature': 0.3,
        'top_p': 0.3,
        'messages': [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    }
    if response_format:
        kwargs['response_format'] = response_format
    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content.strip()
