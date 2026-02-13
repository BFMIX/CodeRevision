import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "service-worker.js", dest: "." },
        { src: "manifest.webmanifest", dest: "." },
        { src: "assets/**/*", dest: "assets" },
      ],
    }),
  ],
});
