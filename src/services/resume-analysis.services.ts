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

Carefully review the resume text provided and give actionable feedback in a **JSON object** with the following structure:

{
  "suggestions": [
    {
      "id": "1",
      "type": "critical" | "warning" | "improvement" | "success",
      "title": "Short title for the suggestion",
      "description": "1–3 lines in simple, friendly language",
      "priority": "high" | "medium" | "low",
      "impact": "3-4 words max with percentage if possible (e.g. '40% higher response rate', 'Better ATS compatibility', '25% more interviews')",
      "category": "Contact" | "Content" | "Optimization" | "Writing" | "Structure",
      "icon": "LucideIconName" // Must be a valid icon name from lucide.dev (e.g. 'Mail', 'User', 'Search')
    },
    {
      "id": "2",
      "type": "improvement",
      "title": "Another suggestion",
      "description": "Another improvement area",
      "priority": "medium",
      "impact": "30% better visibility",
      "category": "Content",
      "icon": "FileText"
    }
  ],
  "score": 75,
  "summary": "Your resume shows good technical skills but needs improvements in formatting and content structure.",
  "keywords": ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"]
}

---

✅ If the resume is good but still has room for improvement:
- Return **at least 3 suggestions** (5 is ideal).
- Include meaningful, specific improvements.
- Don't repeat the same type of suggestion.
- Score should be between 0-100 based on overall quality.
- Summary should be 1-2 sentences describing the resume's current state.
- Keywords should be 5-10 relevant skills/technologies to add.

✅ If the resume is truly perfect:
Return exactly **one suggestion** with high score:

{
  "suggestions": [
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
  ],
  "score": 95,
  "summary": "Your resume is well-crafted and professional. It effectively showcases your skills and experience.",
  "keywords": []
}

⚠️ If the input is **not a resume** (like a blog post, invoice, or story), return:

{
  "suggestions": [
    {
      "id": "1",
      "type": "warning",
      "title": "Unrecognized Content",
      "description": "The uploaded file doesn't look like a resume. Please upload a valid resume document.",
      "priority": "medium",
      "impact": "Cannot provide suggestions",
      "category": "Structure",
      "icon": "AlertTriangle"
    }
  ],
  "score": 0,
  "summary": "The uploaded content does not appear to be a resume.",
  "keywords": []
}

---

❗ Output Rules:
- MUST return a valid **JSON object** with suggestions, score, summary, and keywords.
- DO NOT include code formatting, markdown, or explanation.
- Score must be a number between 0-100.
- Summary must be 1-2 sentences.
- Keywords must be an array of strings (5-10 items max).
- Each suggestion must be a complete object with all required fields.
- Impact field must be 3-4 words max with percentage when possible.
- Required suggestion fields: id, type, title, description, priority, impact, category, icon
`;

export const analyzeResumeAI = async (resumeText: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt + "\n\n" + resumeText }],
  });

  return response.choices[0].message.content;
};
