import { GeneratePodcastProps } from "@/types/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "./ui/use-toast";
import { base64ToArrayBuffer } from "@/utils";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageID,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const getPodcastAudio = useAction(api.tts.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioURL = useMutation(api.podcasts.getURL);

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
      const response = await getPodcastAudio({
        input: voicePrompt.replace(/^\s*$/gim, ""),
        voice: voiceType,
      });

      const buffer = base64ToArrayBuffer(response);

      const blob = new Blob([buffer], { type: "audio/mpeg" });
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
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt To Generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value.trimStart())}
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
