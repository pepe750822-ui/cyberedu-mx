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
import { useAuth } from "@/contexts/AuthContext";

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

const SCHOOLS = [
    // UNAM - Escuela Nacional Preparatoria (ENP)
    { name: "UNAM - ENP 1 (Gabino Barreda)", score: 108 },
    { name: "UNAM - ENP 2 (Erasmo Castellanos)", score: 108 },
    { name: "UNAM - ENP 3 (Justo Sierra)", score: 107 },
    { name: "UNAM - ENP 4 (Vidal Castañeda)", score: 106 },
    { name: "UNAM - ENP 5 (José Vasconcelos)", score: 107 },
    { name: "UNAM - ENP 6 (Antonio Caso)", score: 111 },
    { name: "UNAM - ENP 7 (Ezequiel A. Chávez)", score: 106 },
    { name: "UNAM - ENP 8 (Miguel E. Schulz)", score: 108 },
    { name: "UNAM - ENP 9 (Pedro de Alba)", score: 109 },
    // UNAM - CCH
    { name: "UNAM - CCH Azcapotzalco", score: 91 },
    { name: "UNAM - CCH Naucalpan", score: 88 },
    { name: "UNAM - CCH Oriente", score: 72 },
    { name: "UNAM - CCH Sur", score: 94 },
    { name: "UNAM - CCH Vallejo", score: 94 },
    // IPN - CECyT
    { name: "IPN - CECyT 1 (Gonzalo Vázquez Vela)", score: 98 },
    { name: "IPN - CECyT 2 (Miguel Bernard)", score: 97 },
    { name: "IPN - CECyT 3 (Estanislao Ramírez)", score: 93 },
    { name: "IPN - CECyT 4 (Lázaro Cárdenas)", score: 92 },
    { name: "IPN - CECyT 5 (Wilfrido Massieu)", score: 97 },
    { name: "IPN - CECyT 6 (Miguel Othón de Mendizábal)", score: 95 },
    { name: "IPN - CECyT 7 (Cuauhtémoc)", score: 91 },
    { name: "IPN - CECyT 8 (Narciso Bassols)", score: 90 },
    { name: "IPN - CECyT 9 (Juan de Dios Bátiz)", score: 104 },
    { name: "IPN - CECyT 10 (Carlos Vallejo)", score: 95 },
    { name: "IPN - CECyT 11 (Wilfrido Massieu Pérez)", score: 93 },
    { name: "IPN - CECyT 12 (José María Morelos)", score: 88 },
    { name: "IPN - CECyT 13 (Ricardo Flores Magón)", score: 86 },
    { name: "IPN - CECyT 14 (Luis Enrique Erro)", score: 88 },
    { name: "IPN - CECyT 15 (Diódoro Antúnez Echegaray)", score: 85 },
    { name: "IPN - CECyT 16 (Hidalgo)", score: 85 },
    { name: "IPN - CECyT 17 (León Torres Origel)", score: 83 },
    { name: "IPN - CECyT 18 (Cauce Loreto)", score: 82 },
    { name: "IPN - CECyT 19 (Olga Tamayo Peralta)", score: 80 },
    // Otras instituciones
    { name: "Colegio de Bachilleres (Promedio)", score: 60 },
    { name: "CONALEP (Promedio)", score: 45 },
    { name: "UACM (Promedio)", score: 70 },
    { name: "Telebachillerato / Incorporado (Promedio)", score: 50 },
    { name: "Otra Escuela", score: 80 },
];

interface ProfileDialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const ProfileDialog = ({ children, open, onOpenChange }: ProfileDialogProps) => {
    const { profile } = useAuth();
    const [name, setName] = useState(localStorage.getItem('user_display_name') || '');
    const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('user_avatar') || AVATARS[0]);
    const [selectedColor, setSelectedColor] = useState(localStorage.getItem('user_theme_color') || 'amber-500');
    const [dailyGoal, setDailyGoal] = useState(localStorage.getItem('user_daily_goal') || '60');
    
    // Target School
    const [targetSchool, setTargetSchool] = useState(localStorage.getItem('user_target_school') || SCHOOLS[0].name);

    const handleSave = () => {
        localStorage.setItem('user_display_name', name);
        localStorage.setItem('user_avatar', selectedAvatar);
        localStorage.setItem('user_theme_color', selectedColor);
        localStorage.setItem('user_daily_goal', dailyGoal);
        localStorage.setItem('user_target_school', targetSchool);
        
        const selectedSchoolData = SCHOOLS.find(s => s.name === targetSchool);
        if (selectedSchoolData) {
            localStorage.setItem('user_target_score', selectedSchoolData.score?.toString() ?? "");
        }

        // Update theme color on root (simplified)
        document.documentElement.style.setProperty('--primary', `var(--${selectedColor.split('-')[0]})`);

        toast.success("Perfil actualizado con éxito", {
            description: "Tus preferencias y meta de escuela han sido guardadas."
        });
        
        // Dispatch event so other components update instantly
        window.dispatchEvent(new Event('profileUpdated'));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/10 text-white rounded-[2.5rem] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Configuración de Perfil
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Avatar Section */}
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avatar Estilo Académico</Label>
                        <div className="flex flex-wrap gap-4">
                            {AVATARS.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={cn(
                                        "h-14 w-14 rounded-2xl overflow-hidden border-2 transition-all p-1",
                                        selectedAvatar === url ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={url} alt="Avatar" className="h-full w-full object-cover rounded-xl" />
                                </button>
                            ))}
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
                                className="w-full bg-white/5 border border-white/10 rounded-md h-12 px-3 text-xs focus:outline-none focus:border-primary/50 text-white [&>option]:bg-slate-900"
                            >
                                <option value="30">30 Minutos (Casual)</option>
                                <option value="60">60 Minutos (Estándar)</option>
                                <option value="90">90 Minutos (Intenso)</option>
                                <option value="120">120 Minutos (Hardcore)</option>
                            </select>
                        </div>
                    </div>

                    {/* Meta de Escuela */}
                    <div className="space-y-2 bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Escuela Primera Opción (Meta)
                        </Label>
                        <select
                            value={targetSchool}
                            onChange={(e) => setTargetSchool(e.target.value)}
                            className="w-full bg-slate-900/50 border border-primary/30 rounded-md h-12 px-3 text-xs font-bold focus:outline-none focus:border-primary text-white [&>option]:bg-slate-900"
                        >
                            {SCHOOLS.map((school, i) => (
                                <option key={i} value={school.name}>{school.name} ({school.score} aciertos)</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-2">Esta línea de corte se usará para medir tu rendimiento en los simuladores.</p>
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

                    {/* Referral Section — visible for all logged-in users */}
                    {profile && (() => {
                        const code = profile.referral_code ||
                            ((profile.name || '').replace(/\s+/g, '').toUpperCase().slice(0, 4).padEnd(4, 'X') +
                             profile.id.slice(0, 4).toUpperCase());
                        const link = `https://cyberedumx.com/auth?ref=${code}`;
                        return (
                            <div className="bg-gray-800 rounded-xl p-4">
                                <h3 className="text-white font-bold mb-2">Tu codigo de referido</h3>
                                <div className="flex gap-2">
                                    <input
                                        value={`cyberedumx.com/auth?ref=${code}`}
                                        readOnly
                                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(link);
                                            toast.success('Link copiado');
                                        }}
                                        className="bg-primary hover:bg-primary/80 text-white rounded-lg px-3 text-sm"
                                    >
                                        Copiar
                                    </Button>
                                </div>
                                <p className="text-gray-400 text-xs mt-2">
                                    Tu y tu amigo reciben 50 tokens cuando se registre con tu link
                                </p>
                                <p className="text-green-400 text-sm mt-1">
                                    Has referido {profile.referral_count ?? 0} amigos = {(profile.referral_count ?? 0) * 50} tokens ganados
                                </p>
                            </div>
                        );
                    })()}

                    <Button
                        onClick={handleSave}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl text-xs mt-4"
                    >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Guardar Configuración
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

