// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getPageItems, getTotalPages } from "@/lib/pagination";

describe("getTotalPages", () => {
    it("never returns less than one page", () => {
        expect(getTotalPages(0, 10)).toBe(1);
    });
    it("rounds up", () => {
        expect(getTotalPages(10, 10)).toBe(1);
        expect(getTotalPages(11, 10)).toBe(2);
    });
});

describe("getPageItems", () => {
    it("lists every page when there are few", () => {
        expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it("collapses the end when near the start", () => {
        expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 20]);
    });
    it("collapses the start when near the end", () => {
        expect(getPageItems(20, 20)).toEqual([1, "ellipsis-start", 16, 17, 18, 19, 20]);
    });
    it("collapses both sides in the middle", () => {
        expect(getPageItems(10, 20)).toEqual([1, "ellipsis-start", 9, 10, 11, "ellipsis-end", 20]);
    });
});