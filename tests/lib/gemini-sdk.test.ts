// @vitest-environment node
import fs from "fs";
import http from "http";
import path from "path";
import type { AddressInfo } from "net";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { analyzeWithGemini, GeminiAnalysisError } from "@/lib/gemini";

let server: http.Server;
let lastRequest: { url: string; headers: http.IncomingHttpHeaders; body: any };
let reply: { status: number; body: unknown };

beforeAll(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (c) => (raw += c));
        req.on("end", () => {
            lastRequest = { url: req.url || "", headers: req.headers, body: JSON.parse(raw || "{}") };
            res.writeHead(reply.status, { "content-type": "application/json" });
            res.end(JSON.stringify(reply.body));
        });
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    process.env.GEMINI_API_BASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    process.env.GEMINI_API_KEY = "test-key";
});
afterAll(() => server.close());

const ok = (text: string) => ({ status: 200, body: { candidates: [{ content: { role: "model", parts: [{ text }] }, finishReason: "STOP" }] } });
beforeEach(() => { reply = ok(JSON.stringify({ summary: "Invoice from Acme.", keywords: ["invoice", "Acme"] })); });

describe("real SDK request to Gemini", () => {
    it("sends a scanned PDF as inline base64 data, with OCR instructions, JSON mode and a system prompt", async () => {
        const pdf = fs.readFileSync(path.join(__dirname, "../fixtures/scanned.pdf"));
        const result = await analyzeWithGemini({ kind: "pdf", base64: pdf.toString("base64") }, "summary");

        expect(result).toEqual({ analysis: "Invoice from Acme.", keywords: ["invoice", "Acme"] });
        expect(lastRequest.url).toContain(":generateContent");
        expect(lastRequest.url).toContain("gemini-2.5-flash");
        expect(lastRequest.headers["x-goog-api-key"]).toBe("test-key");

        const parts = lastRequest.body.contents[0].parts;
        const inline = parts.find((p: any) => p.inlineData || p.inline_data);
        const data = (inline.inlineData || inline.inline_data);
        expect(data.mimeType || data.mime_type).toBe("application/pdf");
        expect(Buffer.from(data.data, "base64").equals(pdf)).toBe(true);
        expect(parts[0].text).toMatch(/OCR|scanned/i);

        const cfg = lastRequest.body.generationConfig;
        expect(cfg.responseMimeType || cfg.response_mime_type).toBe("application/json");
        expect(JSON.stringify(lastRequest.body.systemInstruction || lastRequest.body.system_instruction)).toContain("document analysis engine");
    });

    it("sends extracted text for non-PDF documents", async () => {
        await analyzeWithGemini({ kind: "text", text: "Acme signed with Jane Doe.", truncated: false }, "entities");
        const texts = lastRequest.body.contents[0].parts.map((p: any) => p.text).join("\n");
        expect(texts).toContain("Acme signed with Jane Doe.");
    });

    it("surfaces Google's HTTP error (e.g. bad API key) with its reason", async () => {
        reply = { status: 400, body: { error: { code: 400, message: "API key not valid. Please pass a valid API key.", status: "INVALID_ARGUMENT" } } };
        const err = await analyzeWithGemini("x", "summary").catch((e) => e);
        expect(err).toBeInstanceOf(GeminiAnalysisError);
        expect(err.message).toContain("API key not valid");
    });

    it("errors clearly when Gemini returns no candidates (e.g. safety block)", async () => {
        reply = { status: 200, body: { promptFeedback: { blockReason: "SAFETY" } } };
        await expect(analyzeWithGemini("x", "summary")).rejects.toThrow(GeminiAnalysisError);
    });
});
