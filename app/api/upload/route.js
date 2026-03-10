import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getRequestContext } from "@/lib/context";
import { uploadFile } from "@/lib/storage";

export async function POST(request) {
    const { error } = await getRequestContext({ request });
    if (error) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Acesso negado" } }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        const { url } = await uploadFile({ file });
        console.log(`File uploaded successfully: ${url}`);

        return NextResponse.json({ url });
    } catch (err) {
        console.error("Upload Error:", err);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
