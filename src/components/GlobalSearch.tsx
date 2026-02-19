import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { areas } from "@/data/areas";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  videoId: string;
  videoTitle: string;
  areaId: string;
  areaName: string;
  AreaIcon: typeof import("lucide-react").BookOpen;
  gradientClass: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const area of areas) {
    for (const video of area.videos) {
      results.push({
        videoId: video.id,
        videoTitle: video.title,
        areaId: area.id,
        areaName: area.name,
        AreaIcon: area.icon,
        gradientClass: area.gradientClass,
      });
    }
  }
  return results;
}

const GlobalSearch = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const index = useMemo(buildIndex, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const words = debouncedQuery.split(/\s+/);
    return index.filter((r) => {
      const haystack = `${r.videoTitle} ${r.areaName}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    }).slice(0, 8);
  }, [debouncedQuery, index]);

  const handleSelect = (r: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(`/area/${r.areaId}?video=${r.videoId}`);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar videos..."
          className="pl-8 pr-8 h-10 md:h-9 w-full md:w-48 lg:w-64 text-sm bg-muted/30 md:bg-muted/50 border-border focus:bg-card transition-colors"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 md:h-3.5 md:w-3.5" />
          </button>
        )}
      </div>

      {open && debouncedQuery && (
        <div className="absolute top-full mt-2 left-0 right-0 md:w-80 bg-popover border border-border rounded-lg shadow-2xl z-50 max-h-[60vh] md:max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No se encontraron videos</p>
          ) : (
            <ul>
              {results.map((r) => {
                const Icon = r.AreaIcon;
                return (
                  <li key={r.videoId}>
                    <button
                      onClick={() => handleSelect(r)}
                      className="w-full text-left px-3 py-2.5 hover:bg-muted/60 flex items-start gap-2.5 transition-colors"
                    >
                      <div className={`${r.gradientClass} p-1.5 rounded-md mt-0.5 shrink-0`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{r.videoTitle}</p>
                        <p className="text-xs text-muted-foreground">{r.areaName}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
