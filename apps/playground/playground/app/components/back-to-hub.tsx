import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating "back to playground hub" link.
 * Drop it once near the top of a system demo page: <BackToHub />.
 * Pass `className` to restyle for your system's aesthetic if needed.
 */
export function BackToHub({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}
