import React, { useEffect, useRef, useState, useCallback } from "react";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { Loader2, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";

interface YouTubePlayerProps {
    videoId: string;
    videoUrl: string;
    tiempoInicial?: number;
    autoPlay?: boolean;
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

const YT_API_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 2;

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    videoUrl,
    tiempoInicial = 0,
    autoPlay = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [isLoadingAPI, setIsLoadingAPI] = useState(false);
    
    const { guardarProgresoVideo } = useVideoProgress();
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Extract YT ID from URL
    const getYTId = (id: string, url: string) => {
        try {
            if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
            if (url.includes('v=')) return new URLSearchParams(url.split('?')[1]).get('v') || id;
            if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
            return id;
        } catch (e) {
            console.error("[YouTubePlayer] Error parsing URL:", url, e);
            return id;
        }
    };
    const ytId = getYTId(videoId, videoUrl);
    const ytWatchUrl = `https://www.youtube.com/watch?v=${ytId}`;

    const stopTracking = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    const startTracking = useCallback(() => {
        if (progressIntervalRef.current) return;
        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current?.getCurrentTime) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                if (duration > 0) {
                    guardarProgresoVideo({
                        videoId,
                        seconds: Math.floor(currentTime),
                        duration: Math.floor(duration),
                        completed: currentTime / duration >= 0.9,
                    });
                    if (currentTime >= duration - 1) stopTracking();
                }
            }
        }, 5000);
    }, [videoId, guardarProgresoVideo, stopTracking]);

    const handleError = useCallback((msg: string, isPermanent = false) => {
        console.error(`[YouTubePlayer] Error: ${msg} (Permanent: ${isPermanent})`);
        stopTracking();
        if (isPermanent || attempts >= MAX_ATTEMPTS) {
            setHasError(true);
            setErrorMsg(msg);
            setIsLoadingAPI(false);
        } else {
            // Reintentar si no es permanente y quedan intentos
            setAttempts(prev => prev + 1);
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [attempts, stopTracking]);

    const openInNewTab = () => {
        window.open(ytWatchUrl, '_blank', 'noopener,noreferrer');
    };

    const initPlayer = useCallback(() => {
        if (!containerRef.current || !window.YT?.Player) {
            console.warn("[YouTubePlayer] Container or YT API not ready for init");
            return;
        }

        if (playerRef.current) {
            try { playerRef.current.destroy(); } catch (e) { console.warn("[YouTubePlayer] Destroy error", e); }
        }

        try {
            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: ytId,
                playerVars: {
                    start: Math.floor(tiempoInicial),
                    autoplay: autoPlay ? 1 : 0,
                    modestbranding: 1,
                    rel: 0,
                    origin: window.location.origin,
                    enablejsapi: 1,
                },
                events: {
                    onReady: (event: any) => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        setIsReady(true);
                        setIsLoadingAPI(false);
                        if (tiempoInicial > 0) event.target.seekTo(tiempoInicial, true);
                    },
                    onStateChange: (event: any) => {
                        if (event.data === 1) startTracking();
                        else stopTracking();
                    },
                    onError: (event: any) => {
                        const codes: Record<number, string> = {
                            2: 'ID de video no válido.',
                            5: 'Error de reproducción HTML5/CORS.',
                            100: 'Video no encontrado o privado.',
                            101: 'El propietario no permite embebido.',
                            150: 'El propietario no permite embebido.',
                        };
                        handleError(codes[event.data] || 'Error al reproducir el video.', true);
                    },
                },
            });
        } catch (e) {
            console.error("[YouTubePlayer] Init exception:", e);
            handleError('No se pudo inicializar el reproductor.', true);
        }
    }, [ytId, tiempoInicial, autoPlay, startTracking, stopTracking, handleError]);

    useEffect(() => {
        let mounted = true;

        const loadAPI = () => {
            if (window.YT?.Player) {
                initPlayer();
                return;
            }

            setIsLoadingAPI(true);
            // Si ya existe un script cargando, solo re-suscribirse al callback
            const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
            
            if (!existingScript) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.id = 'yt-iframe-api';
                tag.onerror = () => {
                    if (mounted) handleError('Fallo crítico al cargar el script de YouTube.');
                };
                document.head.appendChild(tag);
            }

            const prevReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevReady) prevReady();
                if (mounted) initPlayer();
            };

            // Timeout de seguridad para la API
            timeoutRef.current = setTimeout(() => {
                if (mounted && !isReady) {
                    console.warn("[YouTubePlayer] API timeout reached");
                    handleError('El reproductor tardó demasiado en cargar.');
                }
            }, YT_API_TIMEOUT_MS);
        };

        loadAPI();

        return () => {
            mounted = false;
            stopTracking();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            // No destruimos el player aquí si queremos que sobreviva a re-renders rápidos
            // pero lo haremos en el próximo init si es necesario
        };
    }, [ytId, attempts, initPlayer, stopTracking, handleError]);

    // ── UI States ──────────────────────────────────────────────
    
    if (hasError) {
        return (
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 p-8 text-center shadow-2xl">
                <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <div className="space-y-1">
                    <p className="text-white font-bold text-base">Acceso Restringido</p>
                    <p className="text-white/50 text-xs max-w-xs">{errorMsg || 'La API de YouTube fue bloqueada por tu red o dispositivo.'}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setAttempts(0); setHasError(false); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
                    >
                        <RefreshCw className="h-4 w-4" /> Reintentar
                    </button>
                    <a
                        href={ytWatchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20"
                    >
                        <ExternalLink className="h-4 w-4" /> Ver en YouTube
                    </a>
                </div>
                <button onClick={openInNewTab} className="text-[10px] text-white/30 hover:text-white/60 underline decoration-white/20 mt-2 font-medium">
                    Abrir directamente (Último recurso)
                </button>
            </div>
        );
    }

    return (
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group rounded-2xl border border-white/5 shadow-inner">
            {(!isReady || isLoadingAPI) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                    </div>
                    <p className="mt-4 text-white/70 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Sincronizando Video...</p>
                    {attempts > 0 && (
                        <p className="mt-2 text-white/30 text-[10px] font-bold">Reintento {attempts}/{MAX_ATTEMPTS}</p>
                    )}
                </div>
            )}
            
            <div ref={containerRef} className="w-full h-full" />
            
            <div className="absolute top-4 left-4 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-20">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">YouTube Live Sync</span>
                </div>
            </div>
        </div>
    );
};

export default YouTubePlayer;

