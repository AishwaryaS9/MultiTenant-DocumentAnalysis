import { jsPDF } from "jspdf";

interface GenerateAnalysisPDFParams {
    name: string;
    createdAt: string | Date;
    aiSummary?: string;
    aiKeywords?: string[];
    sentiment?: string | null;
    user: {
        name?: string | null;
        email?: string | null;
    };
}

export const generateAnalysisPDF = ({
    name,
    createdAt,
    aiSummary,
    aiKeywords = [],
    sentiment,
    user,
}: GenerateAnalysisPDFParams) => {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxContentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // Top Accent Bar
    pdf.setFillColor(249, 115, 22);
    pdf.rect(0, 0, pageWidth, 4, "F");

    // Title
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(26, 26, 26);

    const titleLines = pdf.splitTextToSize(
        `AI Analysis Report: ${name}`,
        maxContentWidth
    );

    pdf.text(titleLines, margin, currentY);

    currentY += titleLines.length * 7 + 4;

    // Metadata
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);

    pdf.text(`Analyzed By: Gemini AI`, margin, currentY);

    pdf.text(
        `Date: ${new Date(createdAt).toLocaleDateString()}`,
        pageWidth - margin - 40,
        currentY
    );

    currentY += 6;

    pdf.text(
        `Uploaded By: ${user.name || user.email || "Unknown User"}`,
        margin,
        currentY
    );

    if (sentiment) {
        pdf.text(
            `Overall Sentiment: ${sentiment.toUpperCase()}`,
            pageWidth - margin - 40,
            currentY
        );
    }

    currentY += 12;

    // Divider
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 12;

    // Summary Heading
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(26, 26, 26);

    pdf.text("Executive Insights Summary", margin, currentY);

    currentY += 8;

    // Summary Content
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(51, 65, 85);

    const cleanSummaryText = aiSummary
        ? aiSummary.replace(/[*#`_-]/g, "")
        : "No summary available.";

    const summaryLines = pdf.splitTextToSize(
        cleanSummaryText,
        maxContentWidth
    );

    summaryLines.forEach((line: string) => {
        if (currentY > 275) {
            pdf.addPage();
            currentY = 25;
        }

        pdf.text(line, margin, currentY);
        currentY += 6.5;
    });

    // Keywords Section
    if (aiKeywords.length > 0) {
        currentY += 10;

        if (currentY > 260) {
            pdf.addPage();
            currentY = 25;
        }

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(26, 26, 26);

        pdf.text("Key Topics Identified", margin, currentY);

        currentY += 8;

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);

        const keywordsString = aiKeywords.join(", ");

        const keywordLines = pdf.splitTextToSize(
            keywordsString,
            maxContentWidth
        );

        keywordLines.forEach((line: string) => {
            if (currentY > 275) {
                pdf.addPage();
                currentY = 25;
            }

            pdf.text(line, margin, currentY);
            currentY += 6;
        });
    }

    pdf.save(`AI_Analysis_${name.replace(/\.[^/.]+$/, "")}.pdf`);
};