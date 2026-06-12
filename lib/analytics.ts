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