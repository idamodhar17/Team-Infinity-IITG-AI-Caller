exports.handler = async function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    // Safely extracting and normalize the user input
    const userInput = (event.SpeechResult || "No input received").toLowerCase().trim();

    // Handleing different user responses
    if (userInput.includes("yes") || userInput.includes("interested")) {
        twiml.say("That's fantastic! I can help you get started. We will send your subscription plan details via SMS shortly.");
        const client = context.getTwilioClient();
        try {
            await client.messages.create({
                to: event.From, // Assuming `event.From` contains the user's phone number
                from: context.TWILIO_PHONE_NUMBER,
                body: "Thank you for your interest in our gym membership!"
            });
            twiml.say("You should receive a text message with the details soon.");
        } catch (err) {
            console.error("Error sending SMS:", err);
            twiml.say("Unfortunately, we couldn't send the SMS at this time. Please reach out to us for details.");
        }
    } else if (userInput.includes("no") || userInput.includes("not interested")) {
        twiml.say("No problem at all. Thank you for your time, and feel free to reach out if you change your mind.");
        twiml.hangup();
    } else {
        // For unclear responses, prompt the user again
        twiml.say("I'm sorry, I didn't quite catch that. Are you interested in purchasing a membership?");
        twiml.gather({
            input: "speech",
            action: `https://${context.DOMAIN_NAME}/process-interest`,
            method: "POST",
            speechTimeout: "auto", // Wait for the user to finish speaking
        });
    }

    // Finalize the callback with the constructed TwiML
    callback(null, twiml);
};
