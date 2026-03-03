import { NextResponse } from "next/server";

export async function GET(request) {
    return NextResponse.json({
        message: "Acesso autorizado ao CRM",
        timestamp: new Date().toISOString()
    });
}
