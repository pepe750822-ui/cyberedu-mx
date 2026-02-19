import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { Button } from "./ui/button";

interface StudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
    description?: string;
}

const StudioModal = ({ isOpen, onClose, url, title, description }: StudioModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 overflow-hidden bg-slate-950 border-indigo-500/30 flex flex-col">
                <DialogHeader className="p-4 border-b border-indigo-500/20 bg-slate-900 flex-row items-center justify-between space-y-0">
                    <div className="flex flex-col">
                        <DialogTitle className="text-indigo-100 flex items-center gap-2">
                            <Maximize2 className="h-4 w-4 text-indigo-400" />
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-indigo-300/60 text-[10px] uppercase tracking-widest mt-0.5">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mr-8">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white"
                            onClick={() => window.open(url, "_blank")}
                        >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver pantalla completa
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-white relative">
                    {/* Iframe for PHP/HTML Content */}
                    <iframe
                        src={url}
                        className="w-full h-full border-none shadow-2xl"
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* Loading state overlay could go here if needed */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StudioModal;
