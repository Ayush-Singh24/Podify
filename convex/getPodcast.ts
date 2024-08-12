import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getPodcastById = query({
  args: { podcastInfo: v.object({ podcastID: v.any() }) },
  handler: async (ctx, args) => {
    console.log(args);
    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("_id"), args.podcastInfo.podcastID))
      .unique();
    if (!podcast) {
      throw new ConvexError("Podcast not found!");
    }
    return podcast;
  },
});
