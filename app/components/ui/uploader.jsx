"use client";
import { useState, useRef } from "react";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export function ImageUploader({ onUpload, label = "Clique ou arraste para subir fotos" }) {
    const [uploading, setUploading] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecione apenas imagens.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onUpload(data.url);
                toast.success("Foto enviada com sucesso!");
            } else {
                toast.error("Erro ao subir imagem.");
            }
        } catch (err) {
            toast.error("Erro na conexão durante o upload.");
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
            onDragLeave={() => setIsOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
                "group relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer overflow-hidden backdrop-blur-sm",
                isOver ? "border-indigo-600 bg-indigo-50/50 scale-[1.02]" : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50",
                uploading && "pointer-events-none opacity-50"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFile(file);
                    e.target.value = null; // Reset so same file can be uploaded again
                }}
                onClick={(e) => e.stopPropagation()} // Prevent parent click
            />

            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white shadow-sm border border-zinc-100",
                isOver ? "scale-110 shadow-indigo-100 text-indigo-600" : "text-zinc-400"
            )}>
                {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            </div>

            <div className="text-center">
                <p className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-none mb-1">{uploading ? "Subindo imagem..." : label}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Formatos aceitos: JPG, PNG, WEBP</p>
            </div>

            {/* Micro-animations Background */}
            <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none">
                <ImageIcon className="absolute top-10 right-10 w-20 h-20 -rotate-12" />
                <ImageIcon className="absolute bottom-10 left-10 w-32 h-32 rotate-12" />
            </div>
        </div>
    );
}
