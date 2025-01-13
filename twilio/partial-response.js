exports.handler = async function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    const userSpeech = event.SpeechResult || "No input detected";

    twiml.say("Hmm, okay. Got it. Let's continue!");
    twiml.redirect(`https://${context.DOMAIN_NAME}/voice-handler`);

    callback(null, twiml);
};
