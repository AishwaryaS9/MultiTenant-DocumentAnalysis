import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeWithGemini(
    text: string,
    analysisType: "summary" | "qa" | "sentiment" | "entities" | "extract"
) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompts = {
            summary: `
Please provide a comprehensive summary of the following document. Include main points, key findings, and conclusions.

Also extract ONLY the 3 to 4 MOST IMPORTANT keywords from the document.

Return response strictly in JSON format:

{
  "summary": "...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Document:
${text}
`,

            qa: `
Based on the following document, generate 5 important questions and their answers.

Also extract ONLY the 3 to 4 MOST IMPORTANT keywords.

Return response strictly in JSON format:

{
  "analysis": "...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Document:
${text}
`,

            sentiment: `
Analyze the sentiment and tone of the following document. Provide overall sentiment (positive/negative/neutral) and key emotional tones detected.

Also extract ONLY the 3 to 4 MOST IMPORTANT keywords.

Return response strictly in JSON format:

{
  "analysis": "...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Document:
${text}
`,

            entities: `
Extract all named entities (people, organizations, locations, dates, etc.) from the following document.

Also extract ONLY the 3 to 4 MOST IMPORTANT keywords.

Return response strictly in JSON format:

{
  "analysis": "...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Document:
${text}
`,

            extract: `
Extract key information from the following document in structured format.

Also extract ONLY the 3 to 4 MOST IMPORTANT keywords.

Return response strictly in JSON format:

{
  "analysis": "...",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Document:
${text}
`,
        };

        const prompt = prompts[analysisType];

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        // Remove markdown code fences if Gemini adds them
        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            analysis:
                parsed.summary ||
                parsed.analysis ||
                "No analysis available",

            // Limit keywords to maximum 4
            keywords: (parsed.keywords || []).slice(0, 4),
        };

    } catch (error) {
        console.error("Gemini error:", error);

        return {
            analysis: `Could not analyze for ${analysisType}`,
            keywords: [],
        };
    }
}