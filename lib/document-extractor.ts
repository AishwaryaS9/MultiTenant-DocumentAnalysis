import { OfficeParser } from "officeparser";
import WordExtractor from "word-extractor";
import * as XLSX from "@e965/xlsx";
import { resolveDocumentKind, type DocumentKind } from "@/lib/document-types";

export type PreparedDocument =
    | { kind: "text"; text: string; truncated: boolean }
    | { kind: "pdf"; base64: string };

export class DocumentExtractionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DocumentExtractionError";
    }
}

const MAX_TEXT_CHARS = 2_000_000;

const MAX_INLINE_PDF_BYTES = 14 * 1024 * 1024;

const FETCH_TIMEOUT_MS = 30_000;

function extractPlainText(buffer: Buffer): string {
    return buffer.toString("utf8").replace(/^\uFEFF/, "");
}

/** docx + pptx (Office Open XML) */
async function extractOpenXml(buffer: Buffer, kind: "docx" | "pptx"): Promise<string> {
    const ast = await OfficeParser.parseOffice(buffer, { fileType: kind });
    const result = await ast.to("text");
    return result.value;
}

/** Legacy binary .doc */
async function extractLegacyDoc(buffer: Buffer): Promise<string> {
    const doc = await new WordExtractor().extract(buffer);
    return [
        doc.getHeaders({ includeFooters: true }),
        doc.getBody(),
        doc.getFootnotes(),
        doc.getEndnotes(),
        doc.getTextboxes?.({ includeHeadersAndFooters: false, includeBody: true }),
    ]
        .filter((part) => typeof part === "string" && part.trim())
        .join("\n\n");
}

const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const OLE_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]);

function assertLooksLikeSpreadsheet(buffer: Buffer, kind: "xlsx" | "xls") {
    const startsWith = (sig: Buffer) => buffer.subarray(0, sig.length).equals(sig);
    const looksBinary = buffer.subarray(0, 1024).includes(0);
    const valid = kind === "xlsx" ? startsWith(ZIP_SIGNATURE) : startsWith(OLE_SIGNATURE) || !looksBinary;
    if (!valid) throw new Error(`Not a valid ${kind} file`);
}

/** xlsx + legacy xls */
function extractSpreadsheet(buffer: Buffer, kind: "xlsx" | "xls"): string {
    assertLooksLikeSpreadsheet(buffer, kind);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const parts: string[] = [];
    for (const sheetName of workbook.SheetNames) {
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], { blankrows: false });
        if (csv.trim()) parts.push(`## Sheet: ${sheetName}\n${csv}`);
    }
    return parts.join("\n\n");
}

function extractLegacyPpt(buffer: Buffer): string {
    const cfb = XLSX.CFB.read(buffer, { type: "buffer" });
    const entry = XLSX.CFB.find(cfb, "/PowerPoint Document");
    if (!entry?.content) {
        throw new DocumentExtractionError("This PowerPoint file could not be read.");
    }
    const data = Buffer.from(entry.content as Uint8Array);

    const SLIDE_CONTAINER = 0x03ee;
    const NOTES_CONTAINER = 0x03f0;
    const TEXT_CHARS_ATOM = 0x0fa0;
    const TEXT_BYTES_ATOM = 0x0fa8;

    let slideNumber = 0;

    const walk = (start: number, end: number, collecting: boolean, sink: string[]) => {
        let pos = start;
        while (pos + 8 <= end) {
            const verInstance = data.readUInt16LE(pos);
            const type = data.readUInt16LE(pos + 2);
            const length = data.readUInt32LE(pos + 4);
            const bodyStart = pos + 8;
            const bodyEnd = Math.min(bodyStart + length, end);
            const isContainer = (verInstance & 0x000f) === 0x000f;

            if (isContainer && type === SLIDE_CONTAINER) {
                slideNumber += 1;
                sink.push(`\n--- Slide ${slideNumber} ---`);
                walk(bodyStart, bodyEnd, true, sink);
            } else if (isContainer && type === NOTES_CONTAINER) {
                const notes: string[] = [];
                walk(bodyStart, bodyEnd, true, notes);
                if (notes.some((line) => /[\p{L}\p{N}]/u.test(line))) {
                    sink.push("[Notes]", ...notes);
                }
            } else if (isContainer) {
                walk(bodyStart, bodyEnd, collecting, sink);
            } else if (collecting && type === TEXT_CHARS_ATOM) {
                sink.push(data.toString("utf16le", bodyStart, bodyEnd));
            } else if (collecting && type === TEXT_BYTES_ATOM) {
                sink.push(data.toString("latin1", bodyStart, bodyEnd));
            }
            pos = bodyEnd;
        }
    };

    const output: string[] = [];
    walk(0, data.length, false, output);

    return output.join("\n").replace(/\r/g, "\n").replace(/\v/g, "\n");
}

// Public API

const KIND_LABEL: Record<DocumentKind, string> = {
    text: "text",
    pdf: "PDF",
    docx: "Word",
    doc: "Word",
    xlsx: "Excel",
    xls: "Excel",
    pptx: "PowerPoint",
    ppt: "PowerPoint",
};

function finalizeText(raw: string, kind: DocumentKind): PreparedDocument {
    const text = raw.replace(/\u0000/g, "").replace(/\n{4,}/g, "\n\n\n").trim();
    if (!text) {
        const imageHint =
            kind === "docx" || kind === "doc" || kind === "pptx" || kind === "ppt"
                ? " If it only contains pictures of text, save or export it as a PDF and upload that instead."
                : "";
        throw new DocumentExtractionError(
            `No readable text was found in this ${KIND_LABEL[kind]} file.${imageHint}`
        );
    }
    const truncated = text.length > MAX_TEXT_CHARS;
    return { kind: "text", text: truncated ? text.slice(0, MAX_TEXT_CHARS) : text, truncated };
}

export async function prepareFromBuffer(buffer: Buffer, kind: DocumentKind): Promise<PreparedDocument> {
    if (buffer.length === 0) {
        throw new DocumentExtractionError("The uploaded file is empty.");
    }

    if (kind === "pdf") {
        if (buffer.length > MAX_INLINE_PDF_BYTES) {
            throw new DocumentExtractionError("This PDF is too large to analyze. Please upload a smaller file.");
        }
        return { kind: "pdf", base64: buffer.toString("base64") };
    }

    try {
        switch (kind) {
            case "text":
                return finalizeText(extractPlainText(buffer), kind);
            case "docx":
            case "pptx":
                return finalizeText(await extractOpenXml(buffer, kind), kind);
            case "doc":
                return finalizeText(await extractLegacyDoc(buffer), kind);
            case "xlsx":
            case "xls":
                return finalizeText(extractSpreadsheet(buffer, kind), kind);
            case "ppt":
                return finalizeText(extractLegacyPpt(buffer), kind);
        }
    } catch (error) {
        if (error instanceof DocumentExtractionError) throw error;
        console.error(`Failed to extract ${kind} document:`, error);
        throw new DocumentExtractionError(
            `This ${KIND_LABEL[kind]} file could not be read. It may be corrupted or password-protected.`
        );
    }
}

async function downloadFile(fileUrl: string): Promise<Buffer> {
    const url = new URL(fileUrl);
    if (url.protocol !== "https:") {
        throw new DocumentExtractionError("The stored file location is invalid.");
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!response.ok) {
        throw new DocumentExtractionError(`The uploaded file could not be retrieved (HTTP ${response.status}).`);
    }
    return Buffer.from(await response.arrayBuffer());
}

export async function loadDocumentForAnalysis(doc: {
    name: string;
    content: string | null;
    fileUrl: string | null;
    fileType: string | null;
}): Promise<PreparedDocument> {
    if (doc.content && doc.content.trim()) {
        return finalizeText(doc.content, "text");
    }

    if (!doc.fileUrl) {
        throw new DocumentExtractionError("This document has no file or content to analyze.");
    }

    const kind = resolveDocumentKind({ url: doc.fileUrl, name: doc.name, mimeType: doc.fileType });
    if (!kind) {
        throw new DocumentExtractionError(
            "This file type is not supported. Supported: PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, MD, CSV, JSON."
        );
    }

    let buffer: Buffer;
    try {
        buffer = await downloadFile(doc.fileUrl);
    } catch (error) {
        if (error instanceof DocumentExtractionError) throw error;
        console.error("Failed to download document file:", error);
        throw new DocumentExtractionError("The uploaded file could not be retrieved. Please try again.");
    }

    return prepareFromBuffer(buffer, kind);
}
