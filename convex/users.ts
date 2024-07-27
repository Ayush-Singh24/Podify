import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    clerkID: v.string(),
    email: v.string(),
    imageURL: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkID: args.clerkID,
      email: args.email,
      image: args.imageURL,
      name: args.name,
    });
  },
});

export const getUserById = query({
  args: { clerkID: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((u) => u.eq(u.field("clerkID"), args.clerkID))
      .unique();
    if (!user) {
      throw new ConvexError("User not found!");
    }

    return user;
  },
});

export const getTopUserByPodcastCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").collect();

    const userData = await Promise.all(
      user.map(async (u) => {
        const podcasts = await ctx.db
          .query("podcasts")
          .filter((p) => p.eq(p.field("authorID"), u.clerkID))
          .collect();

        const sortedPodcasts = podcasts.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalPodcasts: podcasts.length,
          podcast: sortedPodcasts.map((p) => ({
            podcastTitle: p.podcastTitle,
            podcastId: p._id,
          })),
        };
      })
    );

    return userData.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
  },
});

export const updateUser = internalMutation({
  args: { clerkID: v.string(), imageURL: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((u) => u.eq(u.field("clerkID"), args.clerkID))
      .unique();
    if (!user) {
      throw new ConvexError("User not found!");
    }

    await ctx.db.patch(user._id, {
      image: args.imageURL,
      email: args.email,
    });

    const podcasts = await ctx.db
      .query("podcasts")
      .filter((p) => p.eq(p.field("authorID"), args.clerkID))
      .collect();
    await Promise.all(
      podcasts.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageURL: args.imageURL,
        });
      })
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkID: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((u) => u.eq(u.field("clerkID"), args.clerkID))
      .unique();
    if (!user) {
      throw new ConvexError("User not found!");
    }

    await ctx.db.delete(user._id);
  },
});
