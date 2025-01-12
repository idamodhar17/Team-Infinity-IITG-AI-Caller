import openai
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = API_KEY

def generate_response(user_query):
    prompt = """
        You are an AI call agent for Infinity Gym. Your job is to convince users to join the gym by answering their questions persuasively. Highlight the gym's features such as:
        - 24/7 access
        - State-of-the-art equipment
        - Personalized training programs
        - Affordable membership plans (800/Month, 4000/6 Months, 6000/Year)
        - Free trial sessions
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_query}
            ],
            max_tokens=100,
            temperature=1
        )
        return response["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"An error occurred: {str(e)}"
