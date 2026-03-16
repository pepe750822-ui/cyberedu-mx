import React, { useState, useEffect } from "react";
import { X, Maximize2, ExternalLink, ZoomIn, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { EduImage } from "@/data/educationalImages";

interface EduImageViewerProps {
  images: EduImage[];
  /** Si true, muestra en modo galería horizontal */
  gallery?: boolean;
}

const AREA_COLORS: Record<string, string> = {
  "Biología":         "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  "Física":           "text-blue-400 bg-blue-500/10 border-blue-500/30",
  "Química":          "text-violet-400 bg-violet-500/10 border-violet-500/30",
  "Matemáticas":      "text-amber-400 bg-amber-500/10 border-amber-500/30",
  "Geografía":        "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  "Historia de México": "text-rose-400 bg-rose-500/10 border-rose-500/30",
  "Historia Universal": "text-orange-400 bg-orange-500/10 border-orange-500/30",
};

// ─── Image Proxy Helper ───
const getProxiedUrl = (url: string) => {
  if (url.includes("wikimedia.org") || url.includes("wikipedia")) {
    // wsrv.nl bypasses Wikimedia rate-limiting and compresses the image
    return `https://wsrv.nl/?url=${url.replace(/^https?:\/\//, '')}&w=800&output=webp`;
  }
  return url;
};

// ─── Lightbox Modal ───
const Lightbox: React.FC<{
  image: EduImage;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}> = ({ image, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  // Cierra con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const areaColor = AREA_COLORS[image.area] || "text-primary bg-primary/10 border-primary/20";

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col bg-slate-950/95 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 bg-primary/20 rounded-lg shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{image.title}</p>
              <span className={cn("inline-block px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border mt-0.5", areaColor)}>
                {image.area}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Abrir imagen original"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-slate-950/50 relative min-h-0">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-xl text-white border border-white/10 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <img
            src={getProxiedUrl(image.url)}
            alt={image.title}
            className="max-w-full max-h-[60vh] object-contain rounded-xl select-none"
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%231e1b4b' width='400' height='200'/%3E%3Ctext fill='%236366f1' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
            }}
          />
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-3 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-xl text-white border border-white/10 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Footer description */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
          <p className="text-xs text-slate-400 leading-relaxed">{image.description}</p>
          {image.source && (
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">
              Fuente: {image.source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Single Image Card ───
const ImageCard: React.FC<{
  image: EduImage;
  onClick: () => void;
}> = ({ image, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const areaColor = AREA_COLORS[image.area] || "text-primary bg-primary/10 border-primary/20";

  return (
    <div
      className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 hover:border-white/20 transition-all duration-300"
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse rounded-2xl" />
      )}

      {/* Image */}
      {!error ? (
        <img
          src={getProxiedUrl(image.url)}
          alt={image.title}
          className={cn(
            "w-full object-cover transition-all duration-500 h-44",
            loaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
          )}
          style={{ objectPosition: "top" }}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
        />
      ) : (
        <div className="h-44 flex items-center justify-center bg-slate-800/50">
          <p className="text-xs text-slate-500 text-center px-4">Imagen no disponible</p>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
          <ZoomIn className="h-3.5 w-3.5 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver imagen</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-white truncate">{image.title}</p>
          <span className={cn("shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase border", areaColor)}>
            {image.area.split(" ")[0]}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
          {image.description}
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ───
const EduImageViewer: React.FC<EduImageViewerProps> = ({ images, gallery = false }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) return null;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const nextImage = () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));

  // Si solo hay una imagen, la mostramos más grande
  if (images.length === 1) {
    return (
      <>
        <div className="my-4 max-w-sm">
          <ImageCard image={images[0]} onClick={() => openLightbox(0)} />
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            image={images[lightboxIndex]}
            onClose={closeLightbox}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={cn(
        "my-4",
        gallery
          ? "flex gap-3 overflow-x-auto pb-2 custom-scrollbar"
          : "grid grid-cols-1 sm:grid-cols-2 gap-3"
      )}>
        {images.map((img, i) => (
          <div key={img.key} className={gallery ? "w-56 shrink-0" : ""}>
            <ImageCard image={img} onClick={() => openLightbox(i)} />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          image={images[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < images.length - 1}
        />
      )}
    </>
  );
};

export default EduImageViewer;
