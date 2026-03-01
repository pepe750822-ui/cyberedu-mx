import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export const useOnlineUsers = () => {
    const [onlineCount, setOnlineCount] = useState(1);

    useEffect(() => {
        const channel = supabase.channel("online-users");

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                // Sum all presence entries across all keys
                const count = Object.values(state).reduce((acc, presences) => acc + (presences as any[]).length, 0);
                setOnlineCount(Math.max(1, count));
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                logger.log("New users joined: ", newPresences);
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                logger.log("Users left: ", leftPresences);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return onlineCount;
};
