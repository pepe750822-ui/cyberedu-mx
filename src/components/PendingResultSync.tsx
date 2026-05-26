import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * PendingResultSync — checks for any simulador result saved while the user was a guest
 * and uploads it once they log in.
 */
export const PendingResultSync = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) return;

        const pendingResultRaw = localStorage.getItem('pending_simulador_result');
        if (!pendingResultRaw) return;

        const uploadPending = async () => {
            try {
                const payload = JSON.parse(pendingResultRaw);

                const { error } = await supabase
                    .from('simulador_results')
                    .insert({
                        ...payload,
                        user_id: user.id
                    });

                if (error) throw error;

                // Success! Clear the pending result
                localStorage.removeItem('pending_simulador_result');

                toast({
                    title: "¡Score guardado!",
                    description: "Tu último resultado del simulador se ha sincronizado con tu cuenta.",
                });
            } catch (error) {
                console.error('[PendingResultSync] Error uploading pending result:', error);
            }
        };

        uploadPending();
    }, [user, toast]);

    return null;
};
