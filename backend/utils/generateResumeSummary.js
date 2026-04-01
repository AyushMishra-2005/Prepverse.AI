import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const extractEmbeddingData = async (userData) => {
  try {
    const userDataStr = JSON.stringify(userData, null, 2);

    const prompt = `
You are a strict resume analyzer for generating embedding-ready text.

====================
CORE RULES (VERY IMPORTANT)
====================
- ONLY use information explicitly present in the JSON.
- DO NOT add or assume anything.
- DO NOT hallucinate.
- Keep output factual, concise, and high-signal.

====================
TASK
====================
1. Identify the candidate’s PRIMARY DOMAIN based on their skills, experience, and projects.

2. Extract ONLY the MOST DOMINANT and RELEVANT SKILLS for that domain.

Examples:
- Software → programming languages, frameworks, systems
- Teaching → subjects, teaching methods, curriculum
- Marketing → SEO, campaigns, analytics, content strategy
- Finance → accounting, financial modeling, Excel
- Design → Figma, UI/UX, prototyping
- Sales → negotiation, CRM tools, lead generation

====================
SKILL SELECTION RULES
====================
- Select ONLY top 5 to 10 MOST IMPORTANT skills
- Prefer skills used in real projects/experience
- Avoid weak, generic, or low-impact skills
- Do NOT include unnecessary tools unless they define the role

====================
WHAT TO REMOVE
====================
- soft skills (communication, teamwork, leadership)
- generic statements
- filler content
- unrelated skills

====================
DOMAIN CLASSIFICATION
====================
Return ONLY 1 to 2 most relevant domains.

Examples:
- Software Development
- Teaching
- Marketing
- Finance
- Human Resources
- Design
- Sales
- Operations
- Business Analytics

====================
EXPERIENCE RULE
====================
- Write 1 to 2 short lines
- Include key skills/tools in each line
- Focus on actual work done (not generic description)

====================
OUTPUT FORMAT (STRICT)
====================
Domains: <comma separated>
Core Skills: <5 to 10 dominant skills comma separated>
Experience: <1 to 2 short skill-rich lines comma separated>

====================

Resume JSON:
${userDataStr}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    });

    const response = completion.choices[0]?.message?.content?.trim();

    if (!response) {
      return { error: "Empty response from LLM" };
    }

    return response;

  } catch (err) {
    console.error("Groq API error:", err.message);
    return { error: err.message };
  }
};