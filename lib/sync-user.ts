import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUserToDatabase() {
    let clerkUser;
    try {
        clerkUser = await currentUser();
    } catch (err: any) {
        if (err?.errors?.[0]?.code === 'resource_not_found') return null;
        throw err;
    }

    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    try {
        // First try to find by clerkUserId
        let dbUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id }
        });

        if (dbUser) {
            // Update existing user matched by Clerk ID
            return await prisma.user.update({
                where: { id: dbUser.id },
                data: { email, name: name || dbUser.name },
            });
        }

        // No match by clerkUserId — check if email already exists
        const existingByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingByEmail) {
            // Claim this record by updating its clerkUserId
            return await prisma.user.update({
                where: { id: existingByEmail.id },
                data: { clerkUserId: clerkUser.id, name: name || existingByEmail.name },
            });
        }

        // Truly new user — safe to create
        const newUser = await prisma.user.create({
            data: { clerkUserId: clerkUser.id, email, name: name || "User" },
        });
        console.log(`New user created: ${email}`);
        return newUser;

    } catch (error) {
        console.error("Error syncing user to database:", error);
        throw error;
    }
}