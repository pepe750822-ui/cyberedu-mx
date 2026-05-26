import { supabase } from "@/integrations/supabase/client";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const subscribe = async (userId: string): Promise<boolean> => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error("[Push] VITE_VAPID_PUBLIC_KEY not set");
      return false;
    }

    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return false;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });


      const { error } = await supabase.from("push_subscriptions").upsert(
        { user_id: userId, subscription: sub.toJSON() },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("[Push] Supabase upsert failed:", error.message, error.code, error.details);
        return false;
      }

      return true;
    } catch (err) {
      console.error("[Push] Subscription error:", err);
      return false;
    }
  };

  return { subscribe };
}
