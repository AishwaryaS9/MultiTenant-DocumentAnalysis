export type PageItem = number | "ellipsis-start" | "ellipsis-end";

export function getTotalPages(totalItems: number, pageSize: number) {
    return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function getPageItems(current: number, total: number, siblings = 1): PageItem[] {
    const slots = siblings * 2 + 5; // first + last + current + siblings + 2 ellipses
    if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);

    const left = Math.max(current - siblings, 1);
    const right = Math.min(current + siblings, total);
    const showStartEllipsis = left > 2;
    const showEndEllipsis = right < total - 1;
    const edgeCount = siblings * 2 + 3;
    const range = (from: number, to: number) =>
        Array.from({ length: to - from + 1 }, (_, i) => from + i);

    if (!showStartEllipsis) return [...range(1, edgeCount), "ellipsis-end", total];
    if (!showEndEllipsis) return [1, "ellipsis-start", ...range(total - edgeCount + 1, total)];
    return [1, "ellipsis-start", ...range(left, right), "ellipsis-end", total];
}