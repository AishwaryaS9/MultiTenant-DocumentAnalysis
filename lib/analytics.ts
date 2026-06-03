import { prisma } from "@/lib/prisma";

export async function getWeeklyDocumentStats(
    organizationId: string
) {
    const sevenDaysAgo = new Date();
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

        const dateKey = date
            .toISOString()
            .split("T")[0];

        const count = documents.filter((doc) => {
            const docDate = doc.createdAt
                .toISOString()
                .split("T")[0];

            return docDate === dateKey;
        }).length;

        return {
            day: date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                }
            ),
            documents: count,
        };
    });
}