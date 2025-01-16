"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { VoiceType } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const voiceCategories: VoiceType[] = ["male", "female"];

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

export default function CreatePodcast() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [voiceType, setVoiceType] = useState<VoiceType>("male");
  const [voicePrompt, setVoicePrompt] = useState<string>("");

  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [imageStorageID, setImageStorageID] = useState<Id<"_storage"> | null>(
    null,
  );
  const [imageURL, setImageURL] = useState<string>("");

  const [audioURL, setAudioURL] = useState<string>("");
  const [audioStorageID, setAudioStorageID] = useState<Id<"_storage"> | null>(
    null,
  );
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      if (!audioURL || !imageURL || !voiceType) {
        toast({
          title: "Please generate audio and image",
        });
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }

      if (!audioStorageID || !imageStorageID) {
        throw new Error("Could not get storage IDs");
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioURL,
        imageURL,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageID: audioStorageID,
        imageStorageID: imageStorageID,
      });

      toast({
        title: "Podcast created!",
      });
      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex flex-col w-full space-y-8"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
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
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              <Select onValueChange={(value: VoiceType) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1 rounded-md",
                  )}
                >
                  <SelectValue
                    placeholder={voiceType}
                    className="placeholder:text-gray-1"
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-orange-1">
                  {voiceCategories.map((voice) => {
                    return (
                      <SelectItem
                        key={voice}
                        value={voice}
                        className="capitalize focus:bg-orange-1"
                      >
                        {voice}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
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
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageID={setAudioStorageID}
              audioStorageID={audioStorageID}
              setAudio={setAudioURL}
              voiceType={voiceType ? voiceType : "male"}
              audio={audioURL}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              setImage={setImageURL}
              setImageStorageID={setImageStorageID}
              imageStorageID={imageStorageID}
              image={imageURL}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Submit & Publish Podcast"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
