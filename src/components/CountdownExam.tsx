import React, { useState, useEffect } from "react";
import { Timer, Zap, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const CountdownExam = () => {
    const targetDate = new Date("2027-06-20T09:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-primary/20 rounded-[2.5rem] p-8 shadow-2xl group transition-all duration-700 hover:border-primary/40">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary animate-bounce">
                        <Flame className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cuenta Regresiva Final</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-tight">
                        Tiempo para asegurar <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">tu lugar en la UNAM/IPN</span>
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-tight">Quedan {timeLeft.days} días de preparación</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    {[
                        { label: "Días", value: timeLeft.days },
                        { label: "Horas", value: timeLeft.hours },
                        { label: "Min", value: timeLeft.minutes },
                        { label: "Seg", value: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="h-20 w-20 md:h-24 md:w-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="hidden lg:block">
                    <div className="h-32 w-32 bg-primary/10 border border-primary/20 rounded-full flex flex-col items-center justify-center text-center p-4 rotate-12 group-hover:rotate-0 transition-transform duration-500 scale-110">
                        <Trophy className="h-8 w-8 text-primary mb-2" />
                        <p className="text-[10px] font-black text-white uppercase leading-none italic">
                            ¡Dale <br /> con todo!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownExam;
