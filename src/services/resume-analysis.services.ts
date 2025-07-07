import pdfParse from "pdf-parse";
import { openai } from "../config/openai";

export function formatResumeText(raw: string): string {
  return (
    raw
      // Remove non-printable characters
      .replace(/[^\x20-\x7E\n\r]/g, "")

      // Add space after colons (Languages:HTML → Languages: HTML)
      .replace(/:\s*/g, ": ")

      // Add space between camelCase or word+date (GauhatiUniversityJULY → Gauhati University JULY)
      .replace(/([a-z])([A-Z])/g, "$1 $2")

      // Normalize multiple line breaks
      .replace(/\n{3,}/g, "\n\n")

      // Normalize multiple spaces/tabs
      .replace(/[ \t]{2,}/g, " ")

      // Trim lines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
  );
}

export const extractResumeText = async (file: any) => {
  const buffer = file.buffer;
  const text = await pdfParse(buffer);
  return formatResumeText(text.text);
};

const prompt = `
You are a helpful and friendly resume improvement assistant.

Carefully review the resume text provided and give actionable feedback in a **JSON array of suggestion objects**.

Each suggestion should follow this exact structure:

[
  {
    "id": "1",
    "type": "critical" | "warning" | "improvement" | "success",
    "title": "Short title for the suggestion",
    "description": "1–3 lines in simple, friendly language",
    "priority": "high" | "medium" | "low",
    "impact": "Optional: e.g. '40% higher response rate'",
    "category": "Contact" | "Content" | "Optimization" | "Writing" | "Structure",
    "icon": "LucideIconName" // Must be a valid icon name from lucide.dev (e.g. 'Mail', 'User', 'Search')
  },
  {
    "id": "2",
    "type": "improvement",
    "title": "Another suggestion",
    "description": "Another improvement area",
    "priority": "medium",
    "impact": "Better visibility",
    "category": "Content",
    "icon": "FileText"
  }
]

---

✅ If the resume is good but still has room for improvement:
- Return **at least 3 suggestions** (5 is ideal).
- Include meaningful, specific improvements.
- Don't repeat the same type of suggestion.
- ALWAYS return an array with multiple objects.

✅ If the resume is truly perfect:
Return exactly **one object** in an array:

[
  {
    "id": "1",
    "type": "success",
    "title": "Excellent Resume",
    "description": "Your resume is clean, well-structured, and covers everything important. No major improvements needed.",
    "priority": "low",
    "impact": "Top-tier quality",
    "category": "Structure",
    "icon": "CheckCircle"
  }
]

⚠️ If the input is **not a resume** (like a blog post, invoice, or story), return:

[
  {
    "id": "1",
    "type": "warning",
    "title": "Unrecognized Content",
    "description": "The uploaded file doesn't look like a resume. Please upload a valid resume document.",
    "priority": "medium",
    "impact": "Cannot provide suggestions without a resume",
    "category": "Structure",
    "icon": "AlertTriangle"
  }
]

---

❗ Output Rules:
- MUST return a valid **JSON array only**.
- DO NOT include code formatting, markdown, or explanation.
- DO NOT return plain objects or JSON strings — only valid arrays.
- ALWAYS wrap your response in square brackets [].
- Each suggestion must be a complete object with all required fields.
`;

export const analyzeResumeAI = async (resumeText: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + "\n\n" + resumeText }],
  });

  return response.choices[0].message.content;
};
