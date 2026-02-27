import { Annotation } from "../types";

export function generatePrompt(annotations: Annotation[]): string {
  const now = new Date().toISOString();
  const pageTitle = document.title || "Untitled";
  const pageUrl = location.href;

  const lines: string[] = [
    "# Visual Annotations",
    "",
    `**Page:** [${pageTitle}](${pageUrl})`,
    `**Annotations:** ${annotations.length}`,
    `**Captured:** ${now}`,
  ];

  annotations.forEach((ann, i) => {
    const { elementInfo: el } = ann;
    lines.push(
      "",
      "---",
      "",
      `## Annotation #${i + 1}`,
      "",
      "**What should change:**",
      `> ${ann.comment}`,
      "",
      "**Element:**",
      `- Tag: \`<${el.tagName}>\``,
      `- Text: "${el.textContent}"`,
      `- Selector: \`${el.selector}\``
    );

    const attrEntries = Object.entries(el.attributes);
    if (attrEntries.length > 0) {
      lines.push(`- Attributes: ${attrEntries.map(([k, v]) => `\`${k}="${v}"\``).join(", ")}`);
    }
  });

  lines.push("");
  return lines.join("\n");
}
