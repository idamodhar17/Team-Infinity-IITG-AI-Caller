import requests
import json
import base64

# Twilio Function URL
TWILIO_FUNCTION_URL = "https://gym-subscription-9245.twil.io/make-calls"

# Twilio Account SID and Auth Token
ACCOUNT_SID = "ACCOUNT_SID"
AUTH_TOKEN = "AUTH_TOKEN"

# Sample user data
user_data = {
    "users": [
        {"name": "Manav", "phone": "+919405623203"}
    ]
}

def test_make_calls():
    try:
        credentials = f"{ACCOUNT_SID}:{AUTH_TOKEN}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        # Sending the POST request to the Twilio function with authentication
        response = requests.post(
            TWILIO_FUNCTION_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Basic {encoded_credentials}"
            },
            json=user_data 
        )
        
        # response from the server
        if response.status_code == 200:
            print("Call initiation successful!")
            print("Response:", response.text)
        else:
            print("Failed to initiate calls.")
            print(f"Status Code: {response.status_code}")
            print("Response:", response.text)
    except Exception as e:
        print("An error occurred:", str(e))

if __name__ == "__main__":
    test_make_calls()
