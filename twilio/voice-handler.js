exports.handler = function (context, event, callback) {
    const twilio = require("twilio");
    const twiml = new twilio.twiml.VoiceResponse();

    const userName = event.name || "User";

    twiml.say(`Hi ${userName}, this is Divya from Infinity Gym.`);

    const gather = twiml.gather({
        input: "speech",
        action: `https://${context.DOMAIN_NAME}/process-response?name=${encodeURIComponent(userName)}`,
        method: "POST",
        speechTimeout: "auto",
        partialResultCallback: `https://${context.DOMAIN_NAME}/handle-interruption?name=${encodeURIComponent(userName)}`,
        partialResultCallbackMethod: "POST",
    });

    gather.say("Our gym is available all over India, so no matter where you are, we've got you covered.");
    gather.say("We offer amazing membership plans with personal training, group classes, and more.");
    gather.say("Do you want to know more?");

    callback(null, twiml);
};
