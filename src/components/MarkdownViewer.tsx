import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertCircle } from "lucide-react";

interface MarkdownViewerProps {
    url: string;
}

export const MarkdownViewer = ({ url }: MarkdownViewerProps) => {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarkdown = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("No se pudo cargar el archivo");
                const text = await response.text();

                // Basic cleaning of Frontmatter if exists
                const cleanedText = text.replace(/^---[\s\S]*?---/, "");
                setContent(cleanedText);
            } catch (err) {
                console.error("Error fetching markdown:", err);
                setError("Error al cargar el contenido de la guía.");
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchMarkdown();
        }
    }, [url]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Renderizando guía de estudio...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-destructive opacity-50" />
                <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
        );
    }

    // Simple Markdown Parser (Heuristic for basic elements since we can't install react-markdown now)
    const renderSimpleMarkdown = (text: string) => {
        return text.split("\n").map((line, i) => {
            // Headers
            if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mt-6 mb-4 text-white border-b border-white/10 pb-2">{line.substring(2)}</h1>;
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-primary">{line.substring(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-indigo-300">{line.substring(4)}</h3>;

            // Tables (Basic support for Markdown tables mapping to HTML)
            if (line.startsWith("|")) {
                // Skip separators
                if (line.includes("---")) return null;
                const cells = line.split("|").filter(cell => cell.trim() !== "" || (line.startsWith("|") && line.endsWith("|")));
                if (cells.length > 0) {
                    return (
                        <div key={i} className="flex border-b border-white/5 py-2 hover:bg-white/5 transition-colors">
                            {cells.map((cell, idx) => (
                                <div key={idx} className={`px-3 text-xs ${idx === 0 ? "font-bold text-slate-300 w-1/3" : "text-slate-400 flex-1"}`}>
                                    {cell.trim().replace(/\*\*/g, "").replace(/\*/g, "")}
                                </div>
                            ))}
                        </div>
                    );
                }
            }

            // Horizontal Rule
            if (line.includes("---") || line.includes("----")) return <hr key={i} className="my-6 border-white/10" />;

            // Lists
            if (line.startsWith("- ") || line.startsWith("* ")) {
                return <li key={i} className="ml-4 text-sm text-slate-300 mb-1 list-disc">{line.substring(2)}</li>;
            }
            if (/^\d+\. /.test(line)) {
                return <li key={i} className="ml-4 text-sm text-slate-300 mb-1 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
            }

            // Paragraphs
            if (line.trim() === "") return <div key={i} className="h-2" />;

            return <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2">{line.replace(/\*\*/g, "").replace(/\*/g, "")}</p>;
        });
    };

    return (
        <ScrollArea className="h-[600px] w-full rounded-md border border-white/10 bg-black/40 p-6">
            <div className="max-w-none prose prose-invert prose-sm">
                {renderSimpleMarkdown(content)}
            </div>
        </ScrollArea>
    );
};
