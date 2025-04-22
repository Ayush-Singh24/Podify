import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { updatePodcast } from "../../convex/podcasts";
import { Loader } from "lucide-react";

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

export default function UpdatePodcastModal({
  isUpdatePodcastModalOpen,
  setIsUpdatePodcastModalOpen,
  podcastID,
  oldPodcastTitle,
  oldPodcastDescription,
}: {
  isUpdatePodcastModalOpen: boolean;
  setIsUpdatePodcastModalOpen: Dispatch<SetStateAction<boolean>>;
  podcastID: Id<"podcasts">;
  oldPodcastTitle: string;
  oldPodcastDescription: string;
}) {
  const [newPodcastTitle, setNewPodcastTitle] =
    useState<string>(oldPodcastTitle);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { toast } = useToast();

  const updatePodcast = useMutation(api.podcasts.updatePodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: oldPodcastTitle,
      podcastDescription: oldPodcastDescription,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await updatePodcast({
        podcastID,
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
      });

      toast({
        description: "Updated details!",
      });

      setIsSubmitting(false);
      setIsUpdatePodcastModalOpen(false);
    } catch (error) {
      toast({
        title: "Whoops!",
        description: "Failed to udpate details!",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isUpdatePodcastModalOpen}
      onOpenChange={setIsUpdatePodcastModalOpen}
    >
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="bg-black-6 border-none text-white-1 px-3 py-4">
        <DialogHeader>
          <DialogTitle className="pl-2">Change Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-2 px-2 flex flex-col w-full space-y-8"
          >
            <div className="flex flex-col gap-[30px]">
              <FormField
                control={form.control}
                name="podcastTitle"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-16 font-bold text-white-1">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        {...field}
                        className="input-class focus-visible:ring-offset-orange-1"
                      />
                    </FormControl>
                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="podcastDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-16 font-bold text-white-1">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a short description for your podcast"
                        {...field}
                        className="input-class focus-visible:ring-offset-orange-1"
                      />
                    </FormControl>
                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Updating...
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
