import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { GenerateThumbnailProps } from "@/types/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { v4 as uuidv4 } from "uuid";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function GenerateThumbnail({
  setImage,
  setImageStorageID,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) {
  const [isAiThumbnail, setIsAiThumbnail] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getImageURL = useMutation(api.podcasts.getURL);
  const generateThumbnail = useAction(api.tti.generateThumbnailAction);

  const imgRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageID = (uploaded[0].response as any).storageId;
      setImageStorageID(storageID);

      const imageURL = await getImageURL({ storageID });

      if (!imageURL) {
        throw new Error("URL could not be generated");
      }

      setImage(imageURL);
      setIsImageLoading(false);
      toast({
        title: "Thumbnail Generated Successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
      });
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Could not upload image!",
      });
    }
  };

  const generateImage = async () => {
    try {
      setIsImageLoading(true);
      const response = await generateThumbnail({
        input: imagePrompt.replace(/^\s*$/gim, ""),
      });
      const blob = new Blob([response]);
      const fileName = `podcast-${uuidv4()}.mp3`;

      handleImage(blob, fileName);
    } catch (error) {
      console.log(error);
      toast({
        title: "Could not upload image!",
      });
    }
  };

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
              onChange={(e) => setImagePrompt(e.target.value.trimStart())}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="button"
              onClick={generateImage}
              disabled={imagePrompt.length > 0 ? false : true}
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
            >
              {isImageLoading ? (
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
        <div className="image_div" onClick={() => imgRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imgRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, JPEG, PNG OR GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
}
