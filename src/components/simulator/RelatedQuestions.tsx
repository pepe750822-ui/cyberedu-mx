import React, { useState, useEffect } from "react";

interface Props {
  area: string;
  questionText: string;
}

const CHAT_URL = "/api/ai-chat";

export const RelatedQuestions: React.FC<Props> = ({ area, questionText }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async () => {
      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `Eres un tutor experto en ECOEMS. El usuario te dará una pregunta de examen. Genera exactamente 2 preguntas relacionadas del mismo tema (${area}) que podrían aparecer en el ECOEMS. Responde SOLO con las preguntas numeradas, sin opciones de respuesta, sin explicaciones. Formato exacto:\n1. [pregunta]\n2. [pregunta]`,
              },
              {
                role: "user",
                content: `Pregunta del simulador: "${questionText}"\n\nGenera 2 preguntas relacionadas del tema ${area} que podrían venir en el ECOEMS.`,
              },
            ],
          }),
        });

        if (!resp.ok || !resp.body) return;

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const c =
                parsed.content ??
                parsed.choices?.[0]?.delta?.content ??
                (parsed.type === "content_block_delta" ? parsed.delta?.text : undefined);
              if (c) fullText += c;
            } catch {}
          }
        }

        if (!cancelled) {
          const lines = fullText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => /^\d+\./.test(l))
            .map((l) => l.replace(/^\d+\.\s*/, ""))
            .slice(0, 3);
          setQuestions(lines);
        }
      } catch {
        // Non-critical — silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [area, questionText]);

  if (loading) {
    return (
      <span className="flex items-center gap-1.5 text-violet-400/60 text-xs">
        <span className="animate-pulse">●</span>
        Generando...
      </span>
    );
  }

  if (questions.length === 0) return null;

  return (
    <ul className="space-y-1.5">
      {questions.map((q, i) => (
        <li key={i} className="text-slate-300 text-xs leading-snug flex gap-2">
          <span className="text-violet-400 font-bold shrink-0">{i + 1}.</span>
          <span>{q}</span>
        </li>
      ))}
    </ul>
  );
};
