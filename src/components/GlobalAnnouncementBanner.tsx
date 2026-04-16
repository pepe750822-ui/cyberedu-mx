import React, { useState, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Announcement {
  content: string;
  type: 'info' | 'warning' | 'success';
}

const GlobalAnnouncementBanner = () => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const resp = await fetch('/api/announcements');
                const data = await resp.json();
                
                if (data && data.content) {
                    const lastDismissed = localStorage.getItem('cyberedu_dismissed_announcement');
                    if (lastDismissed !== data.content) {
                        setAnnouncement(data);
                        setIsVisible(true);
                    }
                }
            } catch (e) {
                console.error("Error fetching announcement", e);
            }
        };

        fetchAnnouncement();
    }, []);

    const handleDismiss = () => {
        if (announcement) {
            localStorage.setItem('cyberedu_dismissed_announcement', announcement.content);
        }
        setIsVisible(false);
        setTimeout(() => setIsDismissed(true), 300); // Wait for animation
    };

    if (!isVisible || isDismissed || !announcement) return null;

    const styles = {
        info: "bg-blue-600 border-blue-400/30 text-white",
        warning: "bg-amber-500 border-amber-300/30 text-amber-950",
        success: "bg-emerald-600 border-emerald-400/30 text-white"
    };

    const icons = {
        info: <Info className="h-4 w-4 shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
        success: <CheckCircle className="h-4 w-4 shrink-0" />
    };

    return (
        <div className={cn(
            "fixed top-0 left-0 right-0 z-[100] p-2 animate-in slide-in-from-top duration-500",
            "flex items-center justify-center pointer-events-none"
        )}>
            <div className={cn(
                "max-w-3xl w-full px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md",
                "flex items-center gap-3 pointer-events-auto",
                styles[announcement.type as keyof typeof styles] || styles.info
            )}>
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 border border-white/10">
                    {icons[announcement.type as keyof typeof icons] || icons.info}
                </div>
                
                <p className="flex-1 text-sm font-black uppercase tracking-tight leading-tight">
                    {announcement.content}
                </p>

                <button 
                    onClick={handleDismiss}
                    className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
                >
                    <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                </button>
            </div>
        </div>
    );
};

export default GlobalAnnouncementBanner;
