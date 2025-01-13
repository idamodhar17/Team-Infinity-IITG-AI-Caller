from flask import Flask, render_template, request
import csv
import os
import requests
import base64

app = Flask(__name__)

# Twilio Function URL
TWILIO_FUNCTION_URL = "https://gym-subscription-9245.twil.io/make-calls"

# Twilio Account SID and Auth Token
ACCOUNT_SID = "ACCOUNT_SID"
AUTH_TOKEN = "AUTH_TOKEN"

# Upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Routing to Index.html
@app.route("/")
def home():
    return render_template("index.html", message=None, error=None)

# Route to upload CSV file
@app.route("/upload", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return render_template("index.html", error="No file uploaded", message=None)

    file = request.files["file"]
    if file.filename == "":
        return render_template("index.html", error="No selected file", message=None)

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        # Read the CSV file
        with open(file_path, "r") as csvfile:
            csv_reader = csv.DictReader(csvfile)

            # Validate headers
            if "name" not in csv_reader.fieldnames or "phone" not in csv_reader.fieldnames:
                return render_template("index.html", error="CSV must have 'name' and 'phone' columns", message=None)

            users = [{"name": row["name"].strip(), "phone": row["phone"].strip()} for row in csv_reader]

        # Call each user
        for user in users:
            response = initiate_call(user)
            # To generate logs & verify working
            print(f"Call response for {user['name']}: {response}")

        return render_template("index.html", message="Calls initiated successfully", error=None)

    except Exception as e:
        return render_template("index.html", error=str(e), message=None)

def initiate_call(user):
    # Function to initiate a call to a user.
    try:
        # Prepare credentials for authorization
        credentials = f"{ACCOUNT_SID}:{AUTH_TOKEN}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        # Make the POST request to the Twilio function
        response = requests.post(
            TWILIO_FUNCTION_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Basic {encoded_credentials}",
            },
            json={"users": [user]},
        )

        # Print status code and response for debugging
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")

        # Check for successful response
        if response.status_code == 200:
            try:
                # Try to parse the response as JSON
                return response.json()
            except ValueError:
                # If JSON parsing fails, return the response as plain text
                return {"message": response.text}
        else:
            # If status code is not 200, return the error text
            return {"error": response.text}

    except Exception as e:
        # Handle any exceptions that occur during the request
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)