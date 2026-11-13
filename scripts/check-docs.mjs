/**
 * 以下の流れでドキュメント品質チェックを行う
 *
 * 1. ルート直下のMarkdownを捜索（サブディレクトリ対象外）
 * 2. Markdownを検査
 *    メタデータがちゃんと定義されているか。リンクが正しいか。
 * 3. draftsの除外設定を確認
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 [Guardrail] Running technical docs quality checks...\n");

let errors = [];

// 1. Gather all production markdown files (root level .md files)
const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
const productionMdFiles = rootEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name);

console.log(
  `📄 Found ${productionMdFiles.length} production markdown files:`,
  productionMdFiles.join(", "),
);

// 2. Validate production markdown files
for (const mdFile of productionMdFiles) {
  const filePath = path.join(rootDir, mdFile);
  const content = fs.readFileSync(filePath, "utf-8");

  // Check 2.1: Heading / title presence
  const hasH1 = /^#\s+.+/m.test(content);
  const hasFrontmatter = /^---\r?\n[\s\S]*?\r?\n---/.test(content);
  if (!hasH1 && !hasFrontmatter) {
    errors.push(
      `${mdFile}: Missing both H1 title ('# ...') and YAML frontmatter.`,
    );
  }

  // Check 2.2: Ensure no links to drafts/ in production docs
  const draftLinkRegex = /\[([^\]]+)\]\((?:\.{0,2}\/)?drafts\/[^)]+\)/g;
  let match;
  while ((match = draftLinkRegex.exec(content)) !== null) {
    errors.push(
      `${mdFile}: References unpublished draft in link: "${match[0]}"`,
    );
  }
}

// 3. Validate .vitepress/config.mts links
const configPath = path.join(rootDir, ".vitepress", "config.mts");
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, "utf-8");

  // Check if drafts/ is linked anywhere in config
  if (/link:\s*["']\/?drafts\//.test(configContent)) {
    errors.push(
      ".vitepress/config.mts: drafts directory is referenced in nav/sidebar links.",
    );
  }

  // Extract internal links from config: link: "/foo"
  const internalLinkRegex = /link:\s*["'](\/[^"']*)["']/g;
  let linkMatch;
  while ((linkMatch = internalLinkRegex.exec(configContent)) !== null) {
    const rawLink = linkMatch[1];
    if (rawLink === "/" || rawLink.startsWith("http")) continue;

    // e.g. /agents-and-skills -> agents-and-skills.md
    const targetFile = rawLink.replace(/^\//, "").split("#")[0] + ".md";
    if (!fs.existsSync(path.join(rootDir, targetFile))) {
      errors.push(
        `.vitepress/config.mts: Link target does not exist: "${rawLink}" (expected "${targetFile}")`,
      );
    }
  }
}

// 4. Verify drafts exclusion in .vitepress/config.mts
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, "utf-8");
  if (
    !configContent.includes("srcExclude") ||
    !configContent.includes("drafts")
  ) {
    errors.push(
      ".vitepress/config.mts: srcExclude must include 'drafts/**' to prevent leaking drafts to production.",
    );
  }
}

if (errors.length > 0) {
  console.error(
    "\n❌ [Guardrail] Quality check failed with the following issues:",
  );
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("\n✅ [Guardrail] Static checks passed successfully!");

// 5. Run VitePress build to guarantee zero build breakage
console.log("\n🔨 [Guardrail] Testing VitePress build output...");
try {
  execSync("npx vitepress build", {
    cwd: rootDir,
    stdio: "inherit",
  });
  console.log("\n🎉 [Guardrail] VitePress build succeeded without errors.");
} catch (e) {
  console.error("\n❌ [Guardrail] VitePress build failed.");
  process.exit(1);
}
