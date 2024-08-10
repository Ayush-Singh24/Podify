"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useClerk();
  const { audio } = useAudio();
  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioURL,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white-1 max-lg:hidden">
            Podify
          </h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link
              key={item.label}
              href={item.route}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                {
                  "bg-nav-focus border-r-4 border-orange-1": isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                width={24}
                height={24}
                alt={item.label}
              />
              <p className="text-white-1">{item.label}</p>
            </Link>
          );
        })}
        <SignedIn>
          <Link
            href={`/profile/${user?.id}`}
            className={cn(
              "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
              {
                "bg-nav-focus border-r-4 border-orange-1":
                  pathname === `/profile/${user?.id}`,
              }
            )}
          >
            <Image
              src="/icons/profile.svg"
              width={24}
              height={24}
              alt="my profile"
            />
            <p className="text-white-1">My Profile</p>
          </Link>
        </SignedIn>
      </nav>
      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={() => signOut(() => router.push("/"))}
          >
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
}
