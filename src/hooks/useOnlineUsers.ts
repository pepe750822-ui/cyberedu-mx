import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useOnlineUsers = () => {
    const [onlineCount, setOnlineCount] = useState(1);

    useEffect(() => {
        const channel = supabase.channel("online-users", {
            config: {
                presence: {
                    key: "user",
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                const count = Object.keys(state).length;
                // Ensure at least 1 (the current user) or a fallback
                setOnlineCount(Math.max(1, count));
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                console.log("New users joined: ", newPresences);
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                console.log("Users left: ", leftPresences);
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
