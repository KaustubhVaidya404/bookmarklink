"use client";

import type React from "react";

import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bookmark, ExternalLink, Loader2, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BookmarkItem {
  id: string;
  url: string;
  tag: string;
  title: string;
  favicon: string;
  summary: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("");
  const [links, setLinks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const checkAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        loadBookmarks();
      }
    });

    return () => checkAuth();
  }, [router]);

  async function loadBookmarks() {
    setIsFetching(true);
    try {
      if (!user) return;

      const q = query(
        collection(db, "users", user.uid, "links"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BookmarkItem[];

      setLinks(items);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const meta = await fetch("/api/metadata?url=" + encodeURIComponent(url))
        .then((res) => res.json())
        .catch((err) => {
          console.error("Error fetching metadata:", err);
          return { title: "Error fetching title", favicon: "" };
        });

      const summaryRes = await fetch(
        "/api/summary?url=" + encodeURIComponent(url)
      );

      if (!summaryRes.ok) {
        const error = await summaryRes
          .json()
          .catch(() => ({ message: "Invalid JSON" }));
        console.error("API Error:", error.message || "Unknown error");
        return;
      }

      const summary = JSON.parse(await summaryRes.text()).summary;

      await addDoc(collection(db, "users", user!.uid, "links"), {
        url,
        tag: tag.trim(),
        summary,
        ...meta,
        createdAt: new Date(),
      });

      setUrl("");
      setTag("");
      await loadBookmarks();
    } catch (error) {
      console.error("Error saving bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "users", user!.uid, "links", id));
      await loadBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-4 md:py-6 space-y-6 md:space-y-8 px-4 md:px-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Add New Bookmark</CardTitle>
            <CardDescription>
              Save a URL to generate an AI summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag">Tag (optional)</Label>
                <Input
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g., article, tutorial, reference"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !url}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save Bookmark
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">Your Bookmarks</h2>

          {isFetching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 md:h-5 w-3/4" />
                        <Skeleton className="h-3 md:h-4 w-full" />
                        <Skeleton className="h-3 md:h-4 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="p-4 md:p-6 text-center text-muted-foreground">
                <p>No bookmarks saved yet. Add your first bookmark above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {links.map((bookmark) => (
                <Card key={bookmark.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-md border flex items-center justify-center bg-muted shrink-0">
                        {bookmark.favicon ? (
                          <img
                            src={bookmark.favicon || "/placeholder.svg"}
                            alt=""
                            className="h-5 w-5 md:h-6 md:w-6 object-contain"
                          />
                        ) : (
                          <Bookmark className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <h3 className="font-medium leading-tight break-words w-full sm:w-auto">
                            {bookmark.title || "Untitled Bookmark"}
                          </h3>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-0 ml-auto">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-7 w-7 md:h-8 md:w-8"
                            >
                              <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                <span className="sr-only">Open link</span>
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 md:h-8 md:w-8 text-destructive"
                              onClick={() => handleDelete(bookmark.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </div>

                        {bookmark.tag && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              <Tag className="mr-1 h-3 w-3" />
                              {bookmark.tag}
                            </Badge>
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {bookmark.summary?.slice(0, 150)}
                          {bookmark.summary?.length > 150 ? "..." : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
