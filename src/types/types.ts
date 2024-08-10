import { Dispatch, SetStateAction } from "react";
import { Id } from "../../convex/_generated/dataModel";

export type VoiceType = "male" | "female";

export interface PodcastCardProps {
  podcastID: Id<"podcasts">;
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

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonLink?: string;
  buttonText?: string;
}

export interface PodcastDetailPlayerProps {
  audioURL?: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageURL?: string;
  podcastID: Id<"podcasts">;
  imageStorageID?: Id<"_storage">;
  audioStorageID?: Id<"_storage">;
  authorImageURL?: string;
  authorID: string;
}

export interface TopPodcastersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  image: string;
  clerkID: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  totalPodcasts: number;
}

export interface CarouselProps {
  fansLikeDetail: TopPodcastersProps[];
}

export interface AudioProps {
  title: string;
  audioURL: string;
  author: string;
  imageURL: string;
  podcastID: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface PodcastProps {
  _id: Id<"podcasts">;
  _creationTime: number;
  audioStorageID?: Id<"_storage"> | null;
  user: Id<"users">;
  podcastTitle: string;
  podcastDescription: string;
  audioURL?: string | null;
  imageURL?: string | null;
  imageStorageID?: Id<"_storage"> | null;
  author: string;
  authorID: string;
  authorImageURL: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface ProfileCardProps {
  podcastsData: PodcastProps[];
  imageURL: string;
  userFirstName: string;
}
