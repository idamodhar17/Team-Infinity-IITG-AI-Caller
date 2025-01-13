exports.handler = async function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    const userName = event.name || "User";
    const userInput = event.SpeechResult || "No input detected";

    const fillers = ["Hmm", "Okay", "Yeah, got it"];
    const randomFiller = fillers[Math.floor(Math.random() * fillers.length)];

    twiml.say(randomFiller);

    if (userInput.endsWith("?")) {
        twiml.redirect({
            method: "POST",
            action: `https://${context.DOMAIN_NAME}/process-response?name=${encodeURIComponent(userName)}`
        });
    } else {
        twiml.say("As I was saying, our gym offers amazing membership plans.");
        twiml.redirect(`https://${context.DOMAIN_NAME}/voice-handler`);
    }

    callback(null, twiml);
};
