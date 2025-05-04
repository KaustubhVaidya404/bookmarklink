import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();
  const summaryRes = await fetch(`https://r.jina.ai/${url}`
    , {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
  });
  if (!summaryRes.ok) {
    throw new Error("Failed to fetch summary");
  }
  const summary = await summaryRes.text();
  if (!summary) {
    return NextResponse.json({ error: "No summary found" }, { status: 404 });
  }
  console.log("Summary:", summary);
  return NextResponse.json({ summary });
}
