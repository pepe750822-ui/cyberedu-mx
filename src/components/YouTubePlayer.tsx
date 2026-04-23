import React, { useEffect, useRef, useState, useCallback } from "react";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";

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

const YT_API_TIMEOUT_MS = 15_000;

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
    const { guardarProgresoVideo } = useVideoProgress();
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Extract YT ID from URL
    const getYTId = (id: string, url: string) => {
        if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
        if (url.includes('v=')) return new URLSearchParams(url.split('?')[1]).get('v') || id;
        return id;
    };
    const ytId = getYTId(videoId, videoUrl);

    // Fallback YouTube watch URL
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

    const handleError = useCallback((msg = 'No se pudo cargar el video.') => {
        stopTracking();
        setHasError(true);
        setErrorMsg(msg);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [stopTracking]);

    useEffect(() => {
        let cancelled = false;

        function initPlayer() {
            if (cancelled || !containerRef.current) return;
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { /* ignore */ }
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
                    },
                    events: {
                        onReady: (event: any) => {
                            if (cancelled) return;
                            if (timeoutRef.current) clearTimeout(timeoutRef.current);
                            setIsReady(true);
                            if (tiempoInicial > 0) event.target.seekTo(tiempoInicial, true);
                        },
                        onStateChange: (event: any) => {
                            if (event.data === 1) startTracking();
                            else stopTracking();
                        },
                        onError: (event: any) => {
                            const codes: Record<number, string> = {
                                2: 'ID de video no válido.',
                                5: 'Error de reproducción HTML5.',
                                100: 'Video no encontrado o privado.',
                                101: 'El propietario no permite embebido.',
                                150: 'El propietario no permite embebido.',
                            };
                            handleError(codes[event.data] || 'Error al reproducir el video.');
                        },
                    },
                });
            } catch (e) {
                handleError('No se pudo inicializar el reproductor.');
            }
        }

        // Timeout de seguridad: si la API no carga en X segundos, mostrar fallback
        timeoutRef.current = setTimeout(() => {
            if (!cancelled && !isReady) {
                handleError('El reproductor tardó demasiado en cargar.');
            }
        }, YT_API_TIMEOUT_MS);

        if (window.YT?.Player) {
            initPlayer();
        } else {
            // Load YT API only once
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.onerror = () => handleError('No se pudo cargar la API de YouTube. Verifica tu conexión.');
                document.head.appendChild(tag);
            }
            const prevReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevReady) prevReady();
                initPlayer();
            };
        }

        return () => {
            cancelled = true;
            stopTracking();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { /* ignore */ }
            }
        };
    }, [ytId]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Error / Fallback UI ──────────────────────────────────────
    if (hasError) {
        return (
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/20 p-6">
                <AlertTriangle className="h-10 w-10 text-amber-400" />
                <p className="text-white/70 text-sm text-center max-w-xs">{errorMsg}</p>
                <a
                    href={ytWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                    Ver en YouTube
                </a>
            </div>
        );
    }

    return (
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
            {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-white/60 text-sm font-medium animate-pulse">Cargando reproductor...</p>
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">YouTube Live Sync</span>
                </div>
            </div>
        </div>
    );
};

export default YouTubePlayer;

