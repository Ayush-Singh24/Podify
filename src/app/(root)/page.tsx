import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";

export default function Home() {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
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
