"use client";

import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("");
  const [links, setLinks] = useState<any>([]);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      loadBookMarks();
    }
  }, [user, router]);

  async function loadBookMarks() {
    const snapshot = await getDocs(
      collection(db, "users", user?.uid!, "links")
    );
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setLinks(items);
  }

  async function handleSave() {
    const meta = await fetch("/api/metadata?url=" + url)
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error fetching metadata:", err);
        return { title: "Error fetching title", favicon: "" };
      });
    const summaryRes = await fetch("/api/summary?url=" + url);
    if (!summaryRes.ok) {
      const error = await summaryRes
        .json()
        .catch(() => ({ message: "Invalid JSON" }));
      console.error("API Error:", error.message || "Unknown error");
    } else {
      const summary = JSON.parse(await summaryRes.text()).summary;
      await addDoc(collection(db, "users", user?.uid!, "links"), {
        url,
        tag,
        summary,
        ...meta,
        createdAt: new Date(),
      });
    }
    setUrl("");
    setTag("");
    loadBookMarks();
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "users", user?.uid!, "links", id));
    loadBookMarks();
  }

  return (
    <div>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL"
      />
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag"
      />
      <button onClick={handleSave}>Save</button>
      <ul>
        {links.map((b) => (
          <li key={b.id}>
            <img src={b.favicon} width={16} height={16} />
            <strong>{b.title}</strong> - {b.summary?.slice(0, 100)}...
            <button onClick={() => handleDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
