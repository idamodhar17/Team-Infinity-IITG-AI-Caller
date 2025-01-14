exports.handler = async function (context, event, callback) {
    const client = context.getTwilioClient();

    try {
        let userList = event.users;

        if (!Array.isArray(userList) || userList.length === 0) {
            return callback(null, "Error: No valid user list provided.");
        }

        // Deduplicate user list based on phone numbers
        const uniqueUsers = [];
        const seenPhones = new Set();

        for (const user of userList) {
            if (user.phone && !seenPhones.has(user.phone)) {
                uniqueUsers.push(user);
                seenPhones.add(user.phone);
            }
        }

        if (uniqueUsers.length === 0) {
            return callback(null, "Error: No valid unique users provided.");
        }

        for (const user of uniqueUsers) {
            if (!user.phone || !user.name) {
                console.log("Skipping invalid user entry:", user);
                continue;
            }

            const voiceHandlerUrl = `https://${context.DOMAIN_NAME}/voice-handler?name=${encodeURIComponent(user.name)}`;

            await client.calls.create({
                to: user.phone,
                from: "+16282096708",
                url: voiceHandlerUrl,
            });
        }

        callback(null, "Calls initiated successfully!");
    } catch (error) {
        console.error("Error initiating calls:", error);
        callback(error);
    }
};
