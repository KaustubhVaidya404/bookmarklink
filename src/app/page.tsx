"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-20">Welcome to LinkBookMark</h1>
      <p className="mt-4 text-lg">Simple way to bookmark websites</p>
      <Button onClick={() => {
        router.push('/login')
      }}>Create Your First Bookmark</Button>
    </main>
  );
}
