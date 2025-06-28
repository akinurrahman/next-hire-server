import xss from "xss";

export const sanitizeRichText = (value: string): string => {
  return xss(value, {
    whiteList: {
      // Headings
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],

      // Paragraphs and text formatting
      p: [],
      strong: [],
      em: [],
      u: [],
      s: [],
      sub: [],
      sup: [],

      // Code formatting
      code: [],
      pre: [],

      // Lists
      ul: [],
      ol: [],
      li: [],

      // Links and media
      a: ["href", "title", "target"],
      img: ["src", "alt", "title"],

      // Semantic elements
      blockquote: [],
      span: ["class"],

      // Tables (uncomment if needed)
      // table: [],
      // thead: [],
      // tbody: [],
      // tr: [],
      // td: [],
      // th: [],

      // Line breaks and dividers
      br: [],
      hr: [],
    },
    stripIgnoreTag: true, // removes disallowed tags like <script>, <style>
    stripIgnoreTagBody: ["script", "style"], // removes the tag body too

    // Additional security for links
    onTagAttr: (tag: string, name: string, value: string) => {
      if (tag === "a" && name === "href") {
        // Block javascript:, data:, and vbscript: URLs
        if (/^(javascript|data|vbscript):/i.test(value)) {
          return "";
        }
        // Optionally restrict to HTTP/HTTPS only
        if (!/^(https?:\/\/|\/|#)/i.test(value)) {
          return "";
        }
      }
      if (tag === "a" && name === "target" && value === "_blank") {
        // Add rel="noopener noreferrer" for security
        return 'target="_blank" rel="noopener noreferrer"';
      }
    },
  });
};
