import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Teste DB
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
            version: "1.0.0"
        });
    } catch (err) {
        return NextResponse.json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: err.message
        }, { status: 503 });
    }
}
