"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

export default function RightSidebar() {
  const { user } = useUser();
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const router = useRouter();
  const { audio } = useAudio();

  if (!topPodcasters) return <LoaderSpinner />;

  return (
    <section
      className={cn("right_sidebar text-white-1 h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioURL,
      })}
    >
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-white-1 text-16 truncate font-semibold">
              {user?.fullName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section className="flex flex-col gap-2">
        <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={topPodcasters!} />
      </section>

      <section className="flex flex-col gap-8 pt-10">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 4).map((podcaster) => {
            return (
              <div
                key={podcaster._id}
                className="flex cursor-pointer justify-between"
                onClick={() => router.push(`/profile/${podcaster.clerkID}`)}
              >
                <figure className="flex items-center gap-2 w-full">
                  <Image
                    src={podcaster.image}
                    alt={podcaster.name}
                    width={44}
                    height={44}
                    className="aspect-square rounded-[50%]"
                  />
                  <h2 className="text-14 font-semibold text-white-1">
                    {podcaster.name}
                  </h2>
                  <p className="text-12 font-normal flex-end ml-auto">
                    {podcaster.totalPodcasts} podcasts
                  </p>
                </figure>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
