import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const apiKey = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION;

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, args) => {
    const ssml = `<speak version='1.0' xml:lang='en-US'> <voice xml:lang='en-US' xml:gender='Male' name='${args.voice === "male" ? "en-US-AndrewMultilingualNeural" : "en-US-PhoebeMultilingualNeural"}'> ${args.input} </voice> </speak>`;

    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
          "Content-Type": "application/ssml+xml",
          "Ocp-Apim-Subscription-Key": apiKey!,
        },
        body: ssml,
      },
    );

    if (!response.ok) {
      throw new ConvexError("Error while generating podcast!");
    }

    return response.arrayBuffer();
  },
});
