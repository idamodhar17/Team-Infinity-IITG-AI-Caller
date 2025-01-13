exports.handler = async function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    const userInput = event.SpeechResult || "No input received";

    if (userInput.toLowerCase().includes("end the call")) {
        twiml.say("Thank you for your time. Goodbye!");
        twiml.hangup();
        return callback(null, twiml);
    }

    // Redirect back to the main handler for further processing
    twiml.redirect(`https://${context.DOMAIN_NAME}/process-response`);
    callback(null, twiml);
};
