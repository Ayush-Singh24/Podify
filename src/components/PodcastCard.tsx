import { PodcastCardProps } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PodcastCard({
  podcastID,
  imgURL,
  description,
  title,
}: PodcastCardProps) {
  const router = useRouter();

  const handleViews = () => {
    // increase views

    router.push(`/podcast/${podcastID}`, {
      scroll: true,
    });
  };
  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgURL}
          width={174}
          height={174}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
}
