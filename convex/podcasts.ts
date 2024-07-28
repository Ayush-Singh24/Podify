import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getURL = mutation({
  args: {
    storageID: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.storage.getUrl(args.storageID as Id<"_storage">);
  },
});
