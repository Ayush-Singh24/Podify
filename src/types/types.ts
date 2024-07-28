import { Dispatch, SetStateAction } from "react";
import { Id } from "../../convex/_generated/dataModel";

export type VoiceType =
  | "alloy"
  | "shimmer"
  | "nova"
  | "echo"
  | "fable"
  | "onyx";

export interface PodcastCardProps {
  podcastID: number;
  imgURL: string;
  description: string;
  title: string;
}

export interface GeneratePodcastProps {
  setAudioStorageID: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  setAudio: Dispatch<SetStateAction<string>>;
  voiceType: VoiceType;
  audio: string;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}
