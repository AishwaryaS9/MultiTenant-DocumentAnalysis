// @vitest-environment node
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { DocumentExtractionError, prepareFromBuffer } from "@/lib/document-extractor";
import { canonicalMimeType, isSupportedDocument, resolveDocumentKind } from "@/lib/document-types";

const fixture = (name: string) => fs.readFileSync(path.join(__dirname, "../fixtures", name));

const KEY_FACTS = ["Acme Corporation", "Jane Doe", "Mumbai"];

describe("extraction: every supported format yields the real content", () => {
    const textFormats: [string, ReturnType<typeof resolveDocumentKind>][] = [
        ["sample.txt", "text"],
        ["sample.md", "text"],
        ["sample.json", "text"],
        ["sample.docx", "docx"],
        ["sample.doc", "doc"],
        ["sample.pptx", "pptx"],
        ["sample.ppt", "ppt"],
    ];

    it.each(textFormats)("%s", async (file, kind) => {
        const result = await prepareFromBuffer(fixture(file), kind!);
        expect(result.kind).toBe("text");
        if (result.kind !== "text") return;
        for (const fact of KEY_FACTS) expect(result.text).toContain(fact);
    });

    it.each(["sample.xlsx", "sample.xls", "sample.csv"])("%s (tabular)", async (file) => {
        const kind = resolveDocumentKind({ name: file })!;
        const result = await prepareFromBuffer(fixture(file), kind);
        expect(result.kind).toBe("text");
        if (result.kind !== "text") return;
        expect(result.text).toContain("Acme Corporation");
        expect(result.text).toContain("Globex Ltd");
        expect(result.text).toContain("Bengaluru");
    });

    it("includes speaker notes for pptx and ppt", async () => {
        for (const [file, kind] of [["sample.pptx", "pptx"], ["sample.ppt", "ppt"]] as const) {
            const result = await prepareFromBuffer(fixture(file), kind);
            expect(result.kind === "text" && result.text).toContain("Speaker note");
        }
    });

    it("keeps table content from Word documents", async () => {
        for (const [file, kind] of [["sample.docx", "docx"], ["sample.doc", "doc"]] as const) {
            const result = await prepareFromBuffer(fixture(file), kind);
            expect(result.kind === "text" && result.text).toContain("Kickoff");
        }
    });

    it("ppt output has no master-slide / empty-notes noise", async () => {
        const result = await prepareFromBuffer(fixture("sample.ppt"), "ppt");
        expect(result.kind === "text" && result.text).not.toMatch(/Click to edit/i);
        expect(result.kind === "text" && result.text).not.toMatch(/\[Notes\]\s*\*/);
    });
});

describe("PDFs (text-based and scanned/image-only) go to Gemini natively", () => {
    it.each(["sample.pdf", "scanned.pdf"])("%s is passed through as a PDF, not text-extracted", async (file) => {
        const buffer = fixture(file);
        const result = await prepareFromBuffer(buffer, "pdf");
        expect(result.kind).toBe("pdf");
        if (result.kind !== "pdf") return;
        expect(Buffer.from(result.base64, "base64").equals(buffer)).toBe(true);
    });
});

describe("failures are explicit, never silent", () => {
    it("rejects an empty file", async () => {
        await expect(prepareFromBuffer(Buffer.alloc(0), "text")).rejects.toThrow(DocumentExtractionError);
    });

    it("rejects whitespace-only text", async () => {
        await expect(prepareFromBuffer(Buffer.from("  \n \t "), "text")).rejects.toThrow(/No readable text/);
    });

    it.each(["docx", "doc", "pptx", "ppt", "xlsx"] as const)("rejects a corrupt %s with a friendly error", async (kind) => {
        await expect(prepareFromBuffer(Buffer.from("this is not a real office file"), kind)).rejects.toThrow(
            DocumentExtractionError
        );
    });

    it("rejects binary garbage named .xls", async () => {
        const garbage = Buffer.concat([Buffer.from([0x00, 0x01, 0x02, 0x03]), Buffer.alloc(200, 7)]);
        await expect(prepareFromBuffer(garbage, "xls")).rejects.toThrow(DocumentExtractionError);
    });

    it("still reads an HTML/CSV export that was saved with an .xls extension", async () => {
        const html = Buffer.from("<table><tr><td>Acme Corporation</td><td>Mumbai</td></tr></table>");
        const result = await prepareFromBuffer(html, "xls");
        expect(result.kind === "text" && result.text).toContain("Acme Corporation");
    });

    it("rejects an oversized PDF", async () => {
        await expect(prepareFromBuffer(Buffer.alloc(15 * 1024 * 1024), "pdf")).rejects.toThrow(/too large/);
    });

    it("truncates extremely long text instead of failing", async () => {
        const result = await prepareFromBuffer(Buffer.from("word ".repeat(600_000)), "text");
        expect(result.kind === "text" && result.truncated).toBe(true);
    });
});

describe("format detection", () => {
    it("recognises all supported extensions", () => {
        const exts = ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "txt", "md", "csv", "json"];
        for (const ext of exts) expect(resolveDocumentKind({ name: `file.${ext}` })).not.toBeNull();
    });

    it("works when the browser reports an empty MIME type (e.g. .md)", () => {
        expect(isSupportedDocument({ name: "notes.md", type: "" })).toBe(true);
        expect(canonicalMimeType({ name: "notes.md", type: "" })).toBe("text/markdown");
    });

    it("is case-insensitive and reads the extension from a blob URL", () => {
        expect(resolveDocumentKind({ name: "REPORT.PDF" })).toBe("pdf");
        expect(
            resolveDocumentKind({ name: "Report", url: "https://x.public.blob.vercel-storage.com/org/user/1-My-Report.docx?x=1" })
        ).toBe("docx");
    });

    it("falls back to MIME type and rejects unsupported formats", () => {
        expect(resolveDocumentKind({ name: "noext", mimeType: "application/pdf" })).toBe("pdf");
        expect(isSupportedDocument({ name: "virus.exe", type: "application/x-msdownload" })).toBe(false);
        expect(isSupportedDocument({ name: "photo.png", type: "image/png" })).toBe(false);
    });
});
