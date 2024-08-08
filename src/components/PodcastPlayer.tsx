"use client";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "./ui/progress";
import { useState } from "react";
import Image from "next/image";

export default function PodcastPlayer() {
  const { audio } = useAudio();
  const [currTime, setCurrTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  return (
    <div
      className={cn("sticky bottom-0 left-0 size-full flex-col", {
        hidden: !audio?.audioURL,
      })}
    >
      <h1 className="text-white-1 text-xl">{audio?.title}</h1>
      <Progress
        value={(currTime / duration) * 100}
        className="w-full"
        max={duration}
      />
      <Image
        src={audio?.imageURL!}
        width={64}
        height={64}
        alt="player"
        className="aspect-square rounded-xl"
      />
    </div>
  );
}
