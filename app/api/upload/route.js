import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getRequestContext } from "@/lib/context";

export async function POST(request) {
    const { error } = await getRequestContext({ request });
    if (error) {
        return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Acesso negado" } }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Nome do arquivo com timestamp para evitar conflitos
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(process.cwd(), "public/uploads", filename);

        // Salvar localmente
        await writeFile(path, buffer);
        console.log(`File saved to ${path}`);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (err) {
        console.error("Upload Error:", err);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
