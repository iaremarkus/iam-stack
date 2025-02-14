"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToasterMessage() {
  const path = usePathname();
  const params = useSearchParams();
  const msg = params.get("msg") || "";
  const type = params.get("type") || "info";

  useEffect(() => {
    if (msg) {
      switch (type) {
        case "info":
          toast.info(msg);
          break;

        case "success":
          toast.success(msg);
          break;

        case "error":
          toast.error(msg);
          break;

        default:
          toast.info(msg);
          break;
      }
    }
  }, [msg, type, path]);

  return null;
}
