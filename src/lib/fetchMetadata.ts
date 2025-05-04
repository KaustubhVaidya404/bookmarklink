export default async function fetchMetadata(url: string) {
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
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "No title found";
    const favicon = new URL("/favicon.ico", url).href;
    return { title, favicon };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { title: "Error fetching title", favicon: "" };
  }
}
