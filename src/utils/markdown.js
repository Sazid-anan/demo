import DOMPurify from "dompurify";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
});

export const renderMarkdown = (input = "") => {
  const html = marked.parse(input || "");
  return DOMPurify.sanitize(html);
};
