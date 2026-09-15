import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/lessons" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    track: z.enum(["common", "python", "cpp"]),
    order: z.number().int().positive(),
    durationMinutes: z.number().int().positive(),
    concepts: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()).optional(),
  }),
});

export const collections = { lessons };
