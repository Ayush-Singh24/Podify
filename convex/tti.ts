import { v } from "convex/values";
import { action } from "./_generated/server";

const apiKey = process.env.CLOUDFLARE_WORKER_API_KEY;
const accountNo = process.env.CLOUDFLARE_WORKER_ACCOUNT_NUMBER;

export const generateThumbnailAction = action({
  args: { input: v.string() },
  handler: async (_, args) => {
    const payload = {
      height: 512,
      width: 512,
      prompt: args.input,
    };

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountNo}/ai/run/@cf/lykon/dreamshaper-8-lcm`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const result = await response.arrayBuffer();
    return result;
  },
});
