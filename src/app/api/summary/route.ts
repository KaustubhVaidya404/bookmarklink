import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();
  const summaryRes = await fetch(`https://r.jina.ai/${url}`);
  const summary = await summaryRes.text();
  console.log("SummaryRes:", summaryRes);
  console.log("Summary:", summary);
  return NextResponse.json({ summary });
}
