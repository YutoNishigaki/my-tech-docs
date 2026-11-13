import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/my-tech-docs/",
  title: "My Tech Docs",
  description: "My Tech Docs",
  srcExclude: ["drafts/**", "**/drafts/**"],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
      label: "目次",
    },
    docFooter: {
      prev: "前のページ",
      next: "次のページ",
    },
    lastUpdated: {
      text: "最終更新日",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "技術ノート", link: "/agents-and-skills" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "技術ノート",
        items: [
          { text: "エージェント・スキル設計ガイド", link: "/agents-and-skills" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
