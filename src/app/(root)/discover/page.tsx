"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";

export default function Discover({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search: search || "",
  });
  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? "Discover Trendidng Podcasts" : "Search results for: "}{" "}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {podcastsData ? (
          <>
            {podcastsData.length > 0 ? (
              <div className="podcast_grid">
                {podcastsData?.map(
                  ({ _id, podcastTitle, podcastDescription, imageURL }) => (
                    <PodcastCard
                      key={_id}
                      imgURL={imageURL!}
                      title={podcastTitle}
                      description={podcastDescription}
                      podcastID={_id}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState title="No results found!" />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
}
