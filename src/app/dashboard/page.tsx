"use client";

import fetchMetadata from "@/lib/fetchMetadata";
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
    const meta = await fetchMetadata(url);
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const { summary } = await res.json();
    await addDoc(collection(db, "users", user?.uid!, "links"), {
      url,
      tag,
      ...meta,
      summary,
      createdAt: new Date(),
    });
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
