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

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validação de tipo de arquivo no backend
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo de arquivo não permitido. Apenas JPG, PNG e WEBP são aceitos." }, { status: 400 });
        }

        // Limite de tamanho (ex: 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "O arquivo é muito grande. Máximo permitido: 5MB." }, { status: 400 });
        }

        const { url } = await uploadFile({ file });
        console.log(`File uploaded successfully: ${url}`);

        return NextResponse.json({ url });
    } catch (err) {
        console.error("Upload Error:", err);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
