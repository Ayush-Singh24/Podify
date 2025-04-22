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
import { useAudio } from "@/providers/AudioProvider";
import ChangeThumbnailModal from "./ChangeThumbnailModal";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Edit, Trash } from "lucide-react";
import UpdatePodcastModal from "./UpdatePodcastModal";

export default function PodcastDetailPlayer({
  isOwner,
  author,
  imageURL,
  authorImageURL,
  podcastTitle,
  podcastDescription,
  podcastID,
  imageStorageID,
  audioURL,
  audioStorageID,
  authorID,
}: PodcastDetailPlayerProps) {
  const router = useRouter();
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] =
    useState<boolean>(false);
  const [isUpdatePodcastModalOpen, setIsUpdatePodcastModalOpen] =
    useState<boolean>(false);

  const deletePodcast = useMutation(api.podcasts.deletePodcast);

  const { toast } = useToast();

  const { setAudio } = useAudio();

  if (!imageStorageID || !audioStorageID) {
    toast({
      title: "Internal Server Error",
    });
    router.push("/");
    return <LoaderSpinner />;
  }

  const handleDelete = async () => {
    try {
      if (!imageStorageID || !audioStorageID) {
        throw new Error("Internal Error");
      }
      router.push("/");
      await deletePodcast({ podcastID, imageStorageID, audioStorageID });

      toast({
        title: "Podcast deleted!",
      });
    } catch (error) {
      console.log("error while deleting podcast");
      toast({
        title: "Could not delete the podcast",
      });
    }
  };

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      podcastID: podcastID,
      audioURL: audioURL ? audioURL : "",
      imageURL: imageURL ? imageURL : "",
      author: author,
    });
  };

  const handleThumbnailChange = () => {
    if (isOwner) {
      setIsThumbnailModalOpen(true);
    }
  };

  if (!imageURL || !authorImageURL) return <LoaderSpinner />;
  return (
    <>
      <ChangeThumbnailModal
        podcastID={podcastID}
        oldImageStorageID={imageStorageID}
        isThumbnailModalOpen={isThumbnailModalOpen}
        setIsThumbnailModalOpen={setIsThumbnailModalOpen}
      />
      <UpdatePodcastModal
        podcastID={podcastID}
        oldPodcastTitle={podcastTitle}
        oldPodcastDescription={podcastDescription}
        setIsUpdatePodcastModalOpen={setIsUpdatePodcastModalOpen}
        isUpdatePodcastModalOpen={isUpdatePodcastModalOpen}
      />
      <div className="mt-6 flex w-full justify-between max-md:justify-center">
        <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
          <Image
            src={imageURL}
            width={250}
            height={250}
            alt="podcast image"
            className={cn("aspect-square rounded-lg  transition-all", {
              "hover:grayscale cursor-pointer": isOwner,
            })}
            onClick={handleThumbnailChange}
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
            <Button
              className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
              onClick={handlePlay}
            >
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
            <Popover>
              <PopoverTrigger>
                <Image
                  src="/icons/three-dots.svg"
                  width={20}
                  height={30}
                  alt="three dots icon"
                  className="cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={10}
                className="bg-black-1 border-black-2"
              >
                <Button
                  variant="ghost"
                  className="text-white-1 hover:bg-black-2 hover:text-white-1 w-full flex justify-start"
                  onClick={() => setIsUpdatePodcastModalOpen(true)}
                >
                  <div className="flex gap-2 items-center">
                    <Edit size={20} />
                    <span>Edit</span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="text-white-1 hover:bg-black-2 hover:text-white-1 w-full flex justify-start"
                >
                  <div className="flex gap-2 items-center">
                    <Trash size={20} />
                    <span>Delete</span>
                  </div>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
