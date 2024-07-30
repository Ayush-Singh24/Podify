import { Dispatch, SetStateAction } from "react";
import { Id } from "../../convex/_generated/dataModel";

export type VoiceType = "male" | "female";

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

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageID: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}
