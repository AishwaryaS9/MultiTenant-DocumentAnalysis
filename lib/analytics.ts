import { prisma } from "@/lib/prisma";

export async function getWeeklyDocumentStats(organizationId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const documents = await prisma.document.findMany({
        where: {
            organizationId,
            createdAt: {
                gte: sevenDaysAgo,
            },
        },
        select: {
            createdAt: true,
        },
    });

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${dayOfMonth}`;

        const count = documents.filter((doc) => {
            const dDate = new Date(doc.createdAt);
            const dYear = dDate.getFullYear();
            const dMonth = String(dDate.getMonth() + 1).padStart(2, '0');
            const dDay = String(dDate.getDate()).padStart(2, '0');
            return `${dYear}-${dMonth}-${dDay}` === dateKey;
        }).length;

        return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            documents: count,
        };
    });
}

export type DocumentsRange = "week" | "month" | "year";

export interface ChartPoint {
    label: string;
    documents: number | null;
}

export type DocumentsChartData = Record<DocumentsRange, ChartPoint[]>;

const dayKey = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;

export function buildDocumentsChartData(dates: Date[]): DocumentsChartData {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Count once per day and once per month
    const dayCounts = new Map<string, number>();
    const monthCounts = new Map<string, number>();

    for (const d of dates) {
        const date = new Date(d);
        dayCounts.set(dayKey(date), (dayCounts.get(dayKey(date)) ?? 0) + 1);
        monthCounts.set(monthKey(date), (monthCounts.get(monthKey(date)) ?? 0) + 1);
    }

    // THIS WEEK (Mon–Sun)
    const mondayOffset = (today.getDay() + 6) % 7;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - mondayOffset);

    const week: ChartPoint[] = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return {
            label: d.toLocaleDateString("en-US", { weekday: "short" }),
            documents: d > today ? null : dayCounts.get(dayKey(d)) ?? 0,
        };
    });

    // THIS MONTH (day 1 → end of month)
    const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ).getDate();

    const month: ChartPoint[] = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
        return {
            label: String(i + 1),
            documents: d > today ? null : dayCounts.get(dayKey(d)) ?? 0,
        };
    });

    // THIS YEAR (Jan → Dec)
    const year: ChartPoint[] = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(today.getFullYear(), i, 1);
        return {
            label: d.toLocaleDateString("en-US", { month: "short" }),
            documents:
                i > today.getMonth() ? null : monthCounts.get(monthKey(d)) ?? 0,
        };
    });

    return { week, month, year };
}