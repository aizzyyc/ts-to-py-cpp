import { getCollection } from "astro:content";

export const prerender = true;

export async function GET() {
  const lessons = await getCollection("lessons");
  const searchEntries = lessons.map(({ data, body }) => ({
    id: data.id,
    content: body ?? "",
  }));

  return new Response(JSON.stringify(searchEntries), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
