import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/context";
import { AvailabilityRepository } from "@/domains/appointments/availability.repository";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const staffId = searchParams.get("staffId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");

    if (!slug || !staffId || !serviceId || !date) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { tenant, timezone } = await getRequestContext({ slug });

    if (!tenant) {
        return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const repo = new AvailabilityRepository(tenant.id);
    const slots = await repo.getAvailableSlots({ staffId, serviceId, date, timezone });

    return NextResponse.json({ slots, timezone });
}
