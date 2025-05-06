"use client";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  function handleClick() {
    router.push("/login");
  }
  const words = [
    {
      text: "Welcome",
    },
    {
      text: "to",
    },
    {
      text: "LinkBookMark",
    },
  ]
  return (
    <div className="relative">
      <BackgroundLines>
        <main className="flex min-h-screen flex-col items-center p-24 relative z-10">
          {/* <h1 className="text-4xl font-bold mb-20">Welcome to LinkBookMark</h1> */}
          <TypewriterEffectSmooth words={words} />
          <p className="mt-4 text-lg">Simple way to bookmark websites</p>
          <Button
            className="mt-8 relative z-20"
            onClick={() => {
              handleClick();
            }}
          >
            Create Your First Bookmark
          </Button>
        </main>
      </BackgroundLines>
    </div>
  );
}