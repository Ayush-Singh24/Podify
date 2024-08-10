"use client";
import { cn, formatTime } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "./ui/progress";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PodcastPlayer() {
  const { audio } = useAudio();
  const [currTime, setCurrTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const handleLoadedMeta = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    const updateCurrentTime = () => {
      if (audioElement) {
        setCurrTime(audioElement.currentTime);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);
    }

    return () =>
      audioElement?.removeEventListener("timeupdate", updateCurrentTime);
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioURL) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(true);
    }
  }, [audio]);

  return (
    <div
      className={cn("sticky bottom-0 left-0 size-full flex-col", {
        hidden: !audio?.audioURL || audio?.audioURL === "",
      })}
    >
      <Progress
        value={(currTime / duration) * 100}
        className="w-full"
        max={duration}
      />
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          onLoadedMetadata={handleLoadedMeta}
          onEnded={handleAudioEnded}
          className="hidden"
          src={audio?.audioURL}
          ref={audioRef}
        />
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio?.podcastID}`}>
            <Image
              src={audio?.imageURL! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player"
              className="aspect-square rounded-xl"
            />
          </Link>
          <div className="flex w-[100px] flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio?.title}
            </h2>
            <p className="font-normal text-12 text-white-2">{audio?.author}</p>
          </div>
        </div>
        <div className="flex justify-between cursor-pointer gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <Image
              src={"/icons/reverse.svg"}
              width={24}
              height={24}
              alt="rewind"
              onClick={rewind}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            alt="play"
            width={30}
            height={30}
            onClick={togglePlayPause}
          />
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4">+5</h2>
            <Image
              src={"/icons/forward.svg"}
              width={24}
              height={24}
              alt="forward"
              onClick={forward}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
          <div className="flex w-full gap-2">
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              alt="mute"
              width={24}
              height={24}
              onClick={toggleMute}
              className="cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
