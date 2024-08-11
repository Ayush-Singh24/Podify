"use client";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@clerk/nextjs";

export default function PodcastDetails({
  params: { podcastID },
}: {
  params: { podcastID: string };
}) {
  const { user } = useUser();
  const podcast = useQuery(api.podcasts.getPodcastByID, {
    podcastID,
  });

  const morePodcasts = useQuery(api.podcasts.getPodcastsByAuthorID, {
    authorID: podcast ? podcast.authorID : "",
  });

  const isOwner = user?.id === podcast?.authorID;

  if (!podcast || !morePodcasts) return <LoaderSpinner />;

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 text-white-1 font-bold">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>
      <PodcastDetailPlayer
        isOwner={isOwner}
        {...podcast}
        podcastID={podcast._id}
      />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.imagePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">More From The Author</h1>

        {morePodcasts && morePodcasts.length > 1 ? (
          <div className="podcast_grid">
            {morePodcasts
              ?.filter((podcast) => podcastID !== podcast._id)
              .map((podcast) => {
                return (
                  <PodcastCard
                    key={podcast._id}
                    imgURL={podcast.imageURL ? podcast.imageURL : ""}
                    title={podcast.podcastTitle}
                    description={podcast.podcastDescription}
                    podcastID={podcast._id}
                  />
                );
              })}
          </div>
        ) : (
          <EmptyState
            title="Nothing more from the author"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
          />
        )}
      </section>
    </section>
  );
}
