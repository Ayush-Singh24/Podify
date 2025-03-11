import { GeneratePodcastProps } from "@/types/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageID,
  audioStorageID,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const getPodcastAudio = useAction(api.tts.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioURL = useMutation(api.podcasts.getURL);
  const deleteAudio = useMutation(api.podcasts.deleteAudio);
  const { toast } = useToast();

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({
        title: "Please provide text to generate a podcast",
      });
      return setIsGenerating(false);
    }
    try {
      if (audioStorageID && audioStorageID.length > 0) {
        await deleteAudio({ audioStorageID: audioStorageID });
      }
      const audioBuffer = await getPodcastAudio({
        input: voicePrompt.replace(/^\s*$/gim, ""),
        voice: voiceType,
      });
      const blob = new Blob([audioBuffer], { type: "audio/wav" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageID = (uploaded[0].response as any).storageId;
      setAudioStorageID(storageID);
      const audioURL = await getAudioURL({ storageID });
      if (!audioURL) {
        console.log("could not get audio url");
        return setIsGenerating(false);
      }
      setAudio(audioURL);
      setIsGenerating(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured while creating the podcast",
      });
      return setIsGenerating(false);
    }
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

export default function GeneratePodcast(props: GeneratePodcastProps) {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_CHARS = 4000;

  useEffect(() => {
    setCharacterCount(props.voicePrompt.length);
  }, [props.voicePrompt]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.trimStart();
    if (text.length <= MAX_CHARS) {
      props.setVoicePrompt(text);
    }
  };

  // Calculate percentage for progress circle
  const percentage = (characterCount / MAX_CHARS) * 100;
  const circumference = 2 * Math.PI * 18; // 18 is the radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getCircleColor = () => {
    if (percentage < 70) return "text-green-500";
    if (percentage < 90) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <Label className="text-16 font-bold text-white-1">
            AI Prompt To Generate Podcast
          </Label>
          <div className="relative h-6 w-6">
            <svg className="w-6 h-6 rotate-[-90deg]">
              <circle
                className="text-gray-300 stroke-current"
                strokeWidth="2"
                fill="transparent"
                r="10"
                cx="12"
                cy="12"
              />
              <circle
                className={`${getCircleColor()} stroke-current`}
                strokeWidth="2"
                fill="transparent"
                r="10"
                cx="12"
                cy="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
          </div>
        </div>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio (max 4000 characters)"
          rows={5}
          value={props.voicePrompt}
          onChange={handleTextChange}
          maxLength={MAX_CHARS}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          onClick={generatePodcast}
          disabled={props.voicePrompt.length > 0 ? false : true}
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
          src={props.audio}
        />
      )}
    </div>
  );
}
