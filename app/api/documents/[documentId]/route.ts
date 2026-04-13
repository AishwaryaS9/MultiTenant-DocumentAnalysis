import { deleteFromBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ documentId: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { documentId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //Get document with organization information
        const document = await prisma.document.findUnique({
            where: {
                id: documentId,
            },
            include: {
                organization: {
                    include: {
                        members: {
                            where: {
                                user: { clerkUserId: userId },
                            },
                        },
                    },
                },
            },
        });
        if (!document) {
            return NextResponse.json({ error: "Document not found or no access" }, { status: 404 });
        }
        if (document.organization.members.length === 0) {
            return NextResponse.json({ error: "You do not have permission to delete this document" }, { status: 403 });
        }

        //Delete file from vercel blob if exists
        if (document.fileUrl) {
            try {
                await deleteFromBlob(document.fileUrl);
            } catch (error) {
                console.log("failed to delete from blob:", error);
            }
        }

        //Delete from DB
        await prisma.document.delete({
            where: { id: documentId },
        });
        return NextResponse.json({ success: true, message: "Document deleted successfully" })
    } catch (error: any) {
        console.error("Delete document error", error);
        return NextResponse.json({ error: error.message || "Failed to delete document" }, { status: 500 });
    }
}