import { action } from "./_generated/server";
import { v } from "convex/values";

const apiKey = process.env.GCP_TTS_API_KEY;

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, args) => {
    const payload = {
      audioConfig: {
        audioEncoding: "MP3",
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
        pitch: 0,
        speakingRate: 1,
      },
      input: {
        text: args.input,
      },
      voice: {
        languageCode: "en-US",
        name: args.voice === "male" ? "en-US-Standard-J" : "en-US-Standard-F",
      },
    };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if ("audioContent" in data) {
      return data.audioContent;
    }
    throw new Error("Podcast could not be created!");
  },
});
