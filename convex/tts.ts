import { action } from "./_generated/server";
import { v } from "convex/values";

const apiKey = "AIzaSyDQkoXec3Sl4BJwSJYvwgkWcgsBTz2zSU0";

export const generateAudioAction = action({
  args: { input: v.string() },
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
        name: "en-US-Journey-F",
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

    return data.audioContent;
  },
});
