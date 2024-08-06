"use client";

import { PodcastDetailPlayerProps } from "@/types/types";
import LoaderSpinner from "./LoaderSpinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function PodcastDetailPlayer({
  isOwner,
  author,
  imageURL,
  authorImageURL,
  podcastTitle,
  podcastID,
  imageStorageID,
  audioStorageID,
  authorID,
}: PodcastDetailPlayerProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (!imageStorageID || !audioStorageID) {
        throw new Error("Internal Error");
      }
      await deletePodcast({ podcastID, imageStorageID, audioStorageID });
    } catch (error) {
      console.log("error while deleting podcast");
      toast({
        title: "Could not delete the podcast",
      });
    }
  };

  if (!imageURL || !authorImageURL) return <LoaderSpinner />;
  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageURL}
          width={250}
          height={250}
          alt="podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => router.push(`/profile/${authorID}`)}
            >
              <Image
                src={authorImageURL}
                width={30}
                height={30}
                alt="author image"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>
          <Button className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1">
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="play button"
            />{" "}
            &nbsp; Play Podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
              onClick={handleDelete}
            >
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="delete"
              />
              <h2 className="text-16 font-normal text-white-1">Delete</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
