import { NextResponse } from "next/server";
import {JSDOM} from "jsdom";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url") || "";
    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    
    try {
        const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!res.ok) {
        throw new Error("Failed to fetch metadata");
        }
    
        const html = await res.text();
        const dom = new JSDOM(html);
        const title = dom.window.document.querySelector("title")?.textContent || "No title found";
        const favicon = new URL("/favicon.ico", url).href;
    
        return NextResponse.json({ title, favicon });
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return NextResponse.json({ error: "Error fetching metadata" }, { status: 500 });
    } 
}