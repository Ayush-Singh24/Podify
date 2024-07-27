"use client";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
// import { useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";

export default function Home() {
  // const tasks = useQuery(api.task.get);
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        {/* <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white-1">
          {tasks?.map((task) => {
            return <div key={task._id}>{task.text}</div>;
          })}
        </div> */}
        <div className="podcast_grid">
          {podcastData.map((podcast) => {
            return (
              <PodcastCard
                key={podcast.id}
                imgURL={podcast.imgURL}
                title={podcast.title}
                description={podcast.description}
                podcastID={podcast.id}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
