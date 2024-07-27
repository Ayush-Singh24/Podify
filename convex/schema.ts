import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    audioStorageID: v.optional(v.id("_storage")),
    imageStorageID: v.optional(v.id("_storage")),
    user: v.id("users"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioURL: v.optional(v.string()),
    imageURL: v.optional(v.string()),
    author: v.string(),
    authorID: v.string(),
    authorImageURL: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "podcastTitle" })
    .searchIndex("search_body", { searchField: "podcastDescription" }),
  users: defineTable({
    email: v.string(),
    image: v.string(),
    clerkID: v.string(),
    name: v.string(),
  }),
});
