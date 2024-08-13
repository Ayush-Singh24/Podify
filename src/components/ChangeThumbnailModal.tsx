import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import GenerateThumbnail from "./GenerateThumbnail";
import { Button } from "./ui/button";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ChangeThumbnailModal({
  isThumbnailModalOpen,
  setIsThumbnailModalOpen,
  oldImageStorageID,
  podcastID,
}: {
  isThumbnailModalOpen: boolean;
  setIsThumbnailModalOpen: Dispatch<SetStateAction<boolean>>;
  podcastID: Id<"podcasts">;
  oldImageStorageID: Id<"_storage">;
}) {
  const [imageURL, setImageURL] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [imageStorageID, setImageStorageID] = useState<Id<"_storage"> | null>(
    oldImageStorageID
  );

  const { toast } = useToast();

  const updateThumbnail = useMutation(api.podcasts.updateThumbnail);

  const changeThumbnail = async () => {
    try {
      if (!imageStorageID) {
        throw new Error("Could not update thumbnail");
      }
      await updateThumbnail({
        imageStorageID,
        imageURL,
        podcastID,
        imagePrompt,
      });

      setImageURL("");
      setImagePrompt("");
      setIsThumbnailModalOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error: Could not update thumbnail",
      });
    }
  };

  return (
    <Dialog open={isThumbnailModalOpen} onOpenChange={setIsThumbnailModalOpen}>
      <DialogContent className="bg-black-6 border-none text-white-1 px-2">
        <DialogHeader>
          <DialogTitle>Change Thumbnail</DialogTitle>
        </DialogHeader>
        <GenerateThumbnail
          image={imageURL}
          setImage={setImageURL}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
          setImageStorageID={setImageStorageID}
        />
        {oldImageStorageID !== imageStorageID && (
          <Button onClick={changeThumbnail}>Change Thumbnail</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
