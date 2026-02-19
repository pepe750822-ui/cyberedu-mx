import React, { useEffect, useRef, useState } from "react";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { Play, Pause, Loader2 } from "lucide-react";

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

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    videoUrl,
    tiempoInicial = 0,
    autoPlay = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const { guardarProgresoVideo } = useVideoProgress();
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Extract YT ID from URL if not provided or if URL is full
    const getYTId = (id: string, url: string) => {
        if (url.includes('embed/')) return url.split('embed/')[1].split('?')[0];
        return id;
    };

    const ytId = getYTId(videoId, videoUrl);

    useEffect(() => {
        // Load YouTube API script if not loaded
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initPlayer();
            };
        } else {
            initPlayer();
        }

        function initPlayer() {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId: ytId,
                playerVars: {
                    start: Math.floor(tiempoInicial),
                    autoplay: autoPlay ? 1 : 0,
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onReady: (event: any) => {
                        setIsReady(true);
                        // If we have a stored time but player didn't start there for some reason
                        if (tiempoInicial > 0) {
                            event.target.seekTo(tiempoInicial, true);
                        }
                    },
                    onStateChange: (event: any) => {
                        // PLAYING = 1
                        if (event.data === 1) {
                            startTracking();
                        } else {
                            stopTracking();
                        }
                    },
                },
            });
        }

        return () => {
            stopTracking();
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [ytId]); // Re-init if video changes

    const startTracking = () => {
        if (progressIntervalRef.current) return;

        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();

                if (duration > 0) {
                    const completed = (currentTime / duration) >= 0.9;

                    guardarProgresoVideo({
                        videoId,
                        seconds: Math.floor(currentTime),
                        duration: Math.floor(duration),
                        completed
                    });

                    // Stop if reached the end (approx)
                    if (currentTime >= duration - 1) {
                        stopTracking();
                    }
                }
            }
        }, 5000);
    };

    const stopTracking = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    return (
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
            {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-white/60 text-sm font-medium animate-pulse">Cargando reproductor...</p>
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />

            {/* Dynamic Overlay Elements could go here */}
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
