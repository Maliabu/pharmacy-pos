// hooks/useDailyReminder.ts
import { useEffect } from "react";
import { toast } from "sonner"

export const useDailyReminder = () => {
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toDateString();
    const currentHour = now.getHours();

    const lastUpdateDate = localStorage.getItem("reminder_last_update");

    const shouldUpdate =
      lastUpdateDate !== currentDate && currentHour >= 11;

    if (shouldUpdate) {
      localStorage.setItem("reminder_last_update", currentDate);

        toast("📨 Notification: Hey, You have messages... :)");
    }

    // const timeout = setTimeout(() => {
    //     toast("📨 Notification: Hey, You have messages... :)");
    //   }, 3000);
    
    //   return () => clearTimeout(timeout);
  }, []);
};
