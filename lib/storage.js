import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Interface simples para armazenamento
 * Pode ser estendida para suportar AWS S3, Cloudflare R2 ou Supabase Storage.
 */
export async function uploadFile({ file, folder = "uploads" }) {
    // FASE 0: Armazenamento Local
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Nome único
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        // Se estiver em produção no Vercel, o armazenamento local não funciona para persistência.
        // Este é o momento que o guia sugere migrar para S3 na Fase 1.
        if (process.env.STORAGE_TYPE === 's3') {
            // Placeholder para implementação S3 (AWS SDK)
            // return uploadToS3(buffer, filename, folder);
            throw new Error("S3 Storage not implemented yet. Configure credentials first.");
        }

        // Local storage (apenas para dev ou VPS com volume persistente)
        const uploadDir = join(process.cwd(), "public", folder);
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        return {
            url: `/${folder}/${filename}`,
            filename
        };
    } catch (error) {
        console.error("Storage Error:", error);
        throw error;
    }
}
