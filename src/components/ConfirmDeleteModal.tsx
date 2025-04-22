import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Id } from "../../convex/_generated/dataModel";

export default function ConfirmDeleteModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
}: {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}) {
  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="bg-black-6 border-none text-white-1 px-3 py-4">
        <DialogHeader>
          <DialogTitle className="pl-2 text-2xl">Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="px-2 text-white-3">
            This action will permanently delete the podcast.
          </div>
          <div className="flex self-end gap-4">
            <Button
              variant="ghost"
              className="border border-black-3 text-xs hover:bg-black-1 hover:text-white-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="border border-black-3 text-xs"
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
