import openai
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = API_KEY

def generate_response(user_query):
    prompt = """
    You are an AI call agent for Infinity Gym. Your job is to answer user queries persuasively and clearly to convince them to join the gym. Use the following information to provide accurate answers:
    - Membership Plans: ₹800/Month, ₹4000/6 Months, ₹6000/Year.
    - Discounts: Seasonal offers and a 10% student discount.
    - Facilities: 24/7 access, state-of-the-art equipment, group fitness classes (yoga, Zumba, HIIT), personal trainers, and a swimming pool.
    - Free Trials: 7-day free trial available.
    - Accessibility: Family plans, wheelchair access, and multi-location access for Premium/Yearly members.
    - Other: No hidden charges, flexible payment options, free parking, and referral bonuses (1 free month for referrals).

    Note:
    -Don't use hello in conversation again and again.
    
    Additionally:
    - If users ask about situations not explicitly covered, such as skipping a month, provide empathetic and logical responses. For example:
        - Explain that membership plans are fixed but offer solutions like freezing their membership for a small fee or upgrading to a flexible plan.
        - Emphasize benefits they can still utilize, like access to online training resources.
        - Suggest visiting during quieter hours if they're concerned about crowds.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_query}
            ],
            max_tokens=200,
            temperature=0.8
        )
        return response["choices"][0]["message"]["content"].strip()
    except openai.error.OpenAIError as api_error:
        return f"OpenAI API Error: {str(api_error)}"
    except Exception as general_error:
        return f"An unexpected error occurred: {str(general_error)}"
