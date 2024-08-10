"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import { api } from "../../../../../convex/_generated/api";
import ProfileCard from "@/components/ProfileCard";

const ProfilePage = ({
  params,
}: {
  params: {
    profileID: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkID: params.profileID,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastsByAuthorID, {
    authorID: params.profileID,
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastsData={podcastsData!}
          imageURL={user?.image!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData && podcastsData.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imgURL={podcast.imageURL!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastID={podcast._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
