
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Settings,
    Palette,
    Target,
    CheckCircle2,
    Camera,
    Ghost
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack"
];

const COLORS = [
    { name: 'Amber', value: 'amber-500', class: 'bg-amber-500' },
    { name: 'Indigo', value: 'indigo-500', class: 'bg-indigo-500' },
    { name: 'Emerald', value: 'emerald-500', class: 'bg-emerald-500' },
    { name: 'Rose', value: 'rose-500', class: 'bg-rose-500' },
];

export const ProfileDialog = ({ children }: { children: React.ReactNode }) => {
    const [name, setName] = useState(localStorage.getItem('user_display_name') || '');
    const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('user_avatar') || AVATARS[0]);
    const [selectedColor, setSelectedColor] = useState(localStorage.getItem('user_theme_color') || 'amber-500');
    const [dailyGoal, setDailyGoal] = useState(localStorage.getItem('user_daily_goal') || '60');

    const handleSave = () => {
        localStorage.setItem('user_display_name', name);
        localStorage.setItem('user_avatar', selectedAvatar);
        localStorage.setItem('user_theme_color', selectedColor);
        localStorage.setItem('user_daily_goal', dailyGoal);

        // Update theme color on root (simplified)
        document.documentElement.style.setProperty('--primary', `var(--${selectedColor.split('-')[0]})`);

        toast.success("Perfil actualizado con éxito", {
            description: "Tus preferencias han sido guardadas localmente."
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/10 text-white rounded-[2.5rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Configuración de Perfil
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-6">
                    {/* Avatar Section */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avatar Estilo Académico</Label>
                        <div className="flex flex-wrap gap-4">
                            {AVATARS.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={cn(
                                        "h-16 w-16 rounded-2xl overflow-hidden border-2 transition-all p-1",
                                        selectedAvatar === url ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={url} alt="Avatar" className="h-full w-full object-cover rounded-xl" />
                                </button>
                            ))}
                            <button className="h-16 w-16 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 opacity-50 hover:opacity-100">
                                <Camera className="h-5 w-5" />
                                <span className="text-[8px] font-bold">SUBIR</span>
                            </button>
                        </div>
                    </div>

                    {/* Name & Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre de Usuario</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Aspirante Pro"
                                className="bg-white/5 border-white/10 focus:border-primary/50 text-xs h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Meta Diaria (Minutos)</Label>
                            <select
                                value={dailyGoal}
                                onChange={(e) => setDailyGoal(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-md h-12 px-3 text-xs focus:outline-none focus:border-primary/50"
                            >
                                <option value="30">30 Minutos (Casual)</option>
                                <option value="60">60 Minutos (Estándar)</option>
                                <option value="90">90 Minutos (Intenso)</option>
                                <option value="120">120 Minutos (Hardcore)</option>
                            </select>
                        </div>
                    </div>

                    {/* Theme Color */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tema Visual de Interfaz</Label>
                        <div className="flex gap-4">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={cn(
                                        "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 border-2 transition-all font-black text-[10px] uppercase",
                                        selectedColor === color.value ? `border-${color.value} bg-${color.value}/10` : "border-transparent bg-white/5 opacity-50"
                                    )}
                                >
                                    <div className={cn("h-3 w-3 rounded-full", color.class)} />
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl text-xs"
                    >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Guardar Configuración
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
