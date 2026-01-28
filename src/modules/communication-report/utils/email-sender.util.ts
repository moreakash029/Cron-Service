import SparkPost from 'sparkpost';

const apiKey =
    process.env.SPARKPOST_API_KEY || "69ee2c20322612adb0929e537c86b97a8037b23a";

let sparky: SparkPost;
try {
    if (!apiKey) {
        console.warn("SPARKPOST_API_KEY environment variable is not set.");
    } else {
        sparky = new SparkPost(apiKey);
    }
} catch (error) {
    console.error("Error initializing SparkPost:", error);
}

export const emailsparkpost = async (config: any) => {
    if (!sparky) {
        console.error("SparkPost client not initialized.");
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "SparkPost client not initialized.",
            }),
        };
    }
    try {
        const response = await sparky.transmissions.send(config);
        return response;
    } catch (err) {
        console.error("Error sending email:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to send email",
            }),
        };
    }
};
