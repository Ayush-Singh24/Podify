import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types/types";

export default function GenerateThumbnail({
  setImage,
  setImageStorageID,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) {
  const [isAiThumbnail, setIsAiThumbnail] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateImage = () => {};
  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant={"plain"}
          onClick={() => setIsAiThumbnail(true)}
          className={cn("", { "bg-black-6": isAiThumbnail })}
        >
          Use AI To Generate Thumbnail
        </Button>
        <Button
          type="button"
          variant={"plain"}
          onClick={() => setIsAiThumbnail(false)}
          className={cn("", { "bg-black-6": !isAiThumbnail })}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5 mt-5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt To Generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              onClick={generateImage}
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
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
