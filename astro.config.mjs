import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [mdx()],
  output: "static",
  site: "https://aizzyyc.github.io",
  base: "/ts-to-py-cpp",
});
