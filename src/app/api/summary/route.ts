import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "";
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  const summaryRes = await fetch(`https://r.jina.ai/${url}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!summaryRes.ok) {
    throw new Error("Failed to fetch summary");
  }
  const summaryData = await summaryRes.json();
  return NextResponse.json({ summary: summaryData.data?.content });
}
