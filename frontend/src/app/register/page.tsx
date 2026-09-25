"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?mode=register");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
      <span>Redirecting to Student Registration Portal...</span>
    </div>
  );
}
