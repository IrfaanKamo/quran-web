"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuthActions } from "@/hooks/useAuthActions";

export function AccountMenu() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [error, setError] = useState<string | null>(null);
  const { handleLogout, isLoading } = useAuthActions();

  useEffect(() => {
    function onDoc(e: Event) {
      // if both refs are null bail
      if (!ref.current && !menuRef.current) return;
      if (
        e.target instanceof Node &&
        !ref.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Position the portal menu when open and on scroll/resize
  useLayoutEffect(() => {
    function compute() {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + window.scrollY + 8;
      let left = rect.right + window.scrollX - 200; // align to the right edge
      left = Math.max(8, Math.min(left, window.innerWidth - 208));
      setMenuPos({ top, left });
    }

    if (open) {
      compute();
      window.addEventListener("resize", compute);
      window.addEventListener("scroll", compute, true);
    }

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open]);

  const initials = (user ? user.username || user.email || "U" : "U")
    .toString()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      {!user ? (
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="text-sm text-green-700 hover:underline">
            Sign in
          </Link>

          <Link href="/auth/register">
            <Button size="sm" variant="default">
              Register
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Button */}
          <button
            ref={buttonRef}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "size-9 flex items-center justify-center rounded-full border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400",
              "w-9 h-9",
            )}
            title={user.username ?? user.email ?? "Profile"}
          >
            {user.avatarUrl ? (
              // If avatar url provided, use <img>
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-800 cursor-pointer">
                {initials}
              </div>
            )}
          </button>

          {/* Portal-based popover so it is not clipped/covered by page decorations */}
          {open &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                ref={menuRef}
                style={{
                  position: "absolute",
                  top: menuPos.top,
                  left: menuPos.left,
                  zIndex: 9999,
                }}
                className="min-w-[200px] rounded-md bg-white border shadow-lg py-2"
              >
                <div className="px-3 py-2 text-xs text-gray-600">Signed in as</div>
                <div className="px-3 pb-2 font-medium text-sm">
                  {user.username ?? user.email}
                </div>
                <div className="border-t my-1" />

                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile
                  </div>
                </Link>

                {error && <div className="px-3 py-2 text-sm text-red-700">{error}</div>}

                <button
                  onClick={async () => {
                    setError(null);
                    try {
                      await handleLogout();
                    } catch (e: any) {
                      setError(e?.message ?? "Logout failed");
                    } finally {
                      router.push("/");
                    }
                  }}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" /> Log out
                    </>
                  )}
                </button>
              </div>,
              document.body,
            )}
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
