import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getURL = mutation({
  args: {
    storageID: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageID);
  },
});

export const createPodcast = mutation({
  args: {
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioURL: v.string(),
    imageURL: v.string(),
    voiceType: v.string(),
    imagePrompt: v.string(),
    voicePrompt: v.string(),
    views: v.number(),
    audioDuration: v.number(),
    audioStorageID: v.id("_storage"),
    imageStorageID: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated!");
    }

    const user = await ctx.db
      .query("users")
      .filter((u) => u.eq(u.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    const podcast = await ctx.db.insert("podcasts", {
      ...args,
      user: user[0]._id,
      author: user[0].name,
      authorID: user[0].clerkID,
      authorImageURL: user[0].image,
    });

    return podcast;
  },
});

export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcasts = await ctx.db.query("podcasts").collect();

    return podcasts;
  },
});

export const getPodcastByID = query({
  args: { podcastID: v.id("podcasts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastID);
  },
});

export const getPodcastsByAuthorID = query({
  args: { authorID: v.string() },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorID"), args.authorID))
      .collect();
    return podcasts;
  },
});

export const deletePodcast = mutation({
  args: {
    podcastID: v.id("podcasts"),
    imageStorageID: v.id("_storage"),
    audioStorageID: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastID);

    if (!podcast) {
      throw new ConvexError("Podcast not found!");
    }

    await ctx.storage.delete(args.audioStorageID);
    await ctx.storage.delete(args.imageStorageID);

    return await ctx.db.delete(args.podcastID);
  },
});
