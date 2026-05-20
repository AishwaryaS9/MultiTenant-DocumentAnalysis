import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function normalizeOrgName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function generateSlug(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name required" },
                { status: 400 }
            );
        }

        const normalizedName =
            normalizeOrgName(name);

        const slug = generateSlug(name);
        
        const existing =
            await prisma.organization.findUnique({
                where: {
                    normalizedName,
                },
            });

        if (existing) {
            return NextResponse.json(
                {
                    error:
                        "Organization already exists",
                },
                { status: 409 }
            );
        }

        return NextResponse.json({
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            {
                error:
                    error.message ||
                    "Something went wrong",
            },
            { status: 500 }
        );
    }
}