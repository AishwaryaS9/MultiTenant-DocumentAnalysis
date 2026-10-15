export type DocumentKind =
    | "text" 
    | "pdf" 
    | "docx"
    | "doc"
    | "xlsx"
    | "xls"
    | "pptx"
    | "ppt";

const EXTENSION_TO_KIND: Record<string, DocumentKind> = {
    txt: "text",
    md: "text",
    markdown: "text",
    csv: "text",
    json: "text",
    pdf: "pdf",
    docx: "docx",
    doc: "doc",
    xlsx: "xlsx",
    xls: "xls",
    pptx: "pptx",
    ppt: "ppt",
};

const MIME_TO_KIND: Record<string, DocumentKind> = {
    "text/plain": "text",
    "text/markdown": "text",
    "text/x-markdown": "text",
    "text/csv": "text",
    "application/json": "text",
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-powerpoint": "ppt",
};

const EXTENSION_TO_MIME: Record<string, string> = {
    txt: "text/plain",
    md: "text/markdown",
    markdown: "text/markdown",
    csv: "text/csv",
    json: "application/json",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
};

export const ACCEPT_ATTRIBUTE = Object.keys(EXTENSION_TO_KIND)
    .map((ext) => `.${ext}`)
    .join(",");

export const SUPPORTED_FORMAT_LABELS = [
    "PDF",
    "DOCX",
    "DOC",
    "XLSX",
    "XLS",
    "PPTX",
    "PPT",
    "TXT",
    "MD",
    "CSV",
    "JSON",
];

export function getExtension(nameOrUrl: string | null | undefined): string {
    if (!nameOrUrl) return "";
    let path = nameOrUrl;
    try {
        if (/^https?:\/\//i.test(nameOrUrl)) {
            path = decodeURIComponent(new URL(nameOrUrl).pathname);
        }
    } catch {
    }
    const match = /\.([a-z0-9]+)$/i.exec(path.trim());
    return match ? match[1].toLowerCase() : "";
}

export function resolveDocumentKind(input: {
    name?: string | null;
    url?: string | null;
    mimeType?: string | null;
}): DocumentKind | null {
    for (const candidate of [input.name, input.url]) {
        const kind = EXTENSION_TO_KIND[getExtension(candidate)];
        if (kind) return kind;
    }

    const mime = (input.mimeType || "").split(";")[0].trim().toLowerCase();
    if (MIME_TO_KIND[mime]) return MIME_TO_KIND[mime];

    return null;
}

export function isSupportedDocument(file: { name: string; type?: string }): boolean {
    return resolveDocumentKind({ name: file.name, mimeType: file.type }) !== null;
}

export function canonicalMimeType(file: { name: string; type?: string }): string {
    if (file.type && file.type !== "application/octet-stream") return file.type;
    return EXTENSION_TO_MIME[getExtension(file.name)] || file.type || "application/octet-stream";
}
