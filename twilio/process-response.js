const axios = require("axios");

exports.handler = async function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    const userInput = (event.SpeechResult || "No input received").toLowerCase();

    try {
        // Check for user intent to end the call
        if (userInput.includes("end the call") || userInput.includes("goodbye") || userInput.includes("stop")) {
            twiml.say("Thank you for your time. Goodbye!");
            twiml.hangup();
            return callback(null, twiml);
        }

        // Check for noncommittal or carry-on phrases
        const continuePhrases = ["hmm", "okay", "continue", "go on", "alright"];
        if (continuePhrases.some(phrase => userInput.includes(phrase))) {
            twiml.say("Great! Are you interested in purchasing a membership? We have amazing offers for you.");
            
            // Continue gathering input for a seamless conversation
            twiml.gather({
                input: "speech",
                action: `https://${context.DOMAIN_NAME}/process-interest`,
                method: "POST",
                speechTimeout: "auto",
            });
        } else {
            // Send other inputs to the external API for processing
            const apiResponse = await axios.post("https://tribal-isotope-447717-q4.el.r.appspot.com/api/voice-input", {
                text: userInput,
            });

            const responseText = apiResponse.data.response || "That's an interesting question. Here's what I found.";
            twiml.say(responseText);
        }

        // Gather input for the next step in the conversation
        twiml.gather({
            input: "speech",
            action: "/process-response",
            method: "POST",
            speechTimeout: "auto",
        });

        twiml.redirect(`https://${context.DOMAIN_NAME}/process-input`);

        callback(null, twiml);
    } catch (error) {
        console.error("Error processing the response:", error);

        // Graceful error handling
        twiml.say("Sorry, I couldn't process that right now. Let's continue.");
        twiml.gather({
            input: "speech",
            action: "/process-response",
            method: "POST",
            speechTimeout: "auto",
        });

        twiml.redirect(`https://${context.DOMAIN_NAME}/process-input`);
        
        callback(null, twiml);
    }
};
