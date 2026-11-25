"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export type RegulInstallState = {
  canInstall: boolean;
  iosHint: boolean;
  install: () => void;
  dismissIos: () => void;
};

const HINT_KEY = "regul-install-hint";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIos() {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function urlsToCache() {
  const found = new Set<string>([
    window.location.href,
    "/regul/icon-192.png",
    "/regul/icon-512.png",
    "/regul/apple-touch-icon.png",
  ]);
  const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (manifest?.href) found.add(manifest.href);

  for (const entry of performance.getEntriesByType("resource")) {
    try {
      const url = new URL(entry.name);
      if (url.origin !== window.location.origin) continue;
      if (url.pathname.startsWith("/_next/static/") || /\/regul(\/|$)/.test(url.pathname)) {
        found.add(url.href);
      }
    } catch {
      // Ignore malformed resource names.
    }
  }

  return [...found];
}

export function RegulOffline() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    void navigator.serviceWorker.register("/regul-sw.js", { scope: "/" }).then(async (registration) => {
      await navigator.serviceWorker.ready;
      if (cancelled) return;
      const worker = registration.active || navigator.serviceWorker.controller;
      worker?.postMessage({ type: "CACHE_URLS", urls: urlsToCache() });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export function useRegulInstall(): RegulInstallState {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    if (isIos() && localStorage.getItem(HINT_KEY) !== "1") setIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return {
    canInstall: prompt !== null,
    iosHint,
    install: () => {
      if (!prompt) return;
      void prompt.prompt().then(() => setPrompt(null));
    },
    dismissIos: () => {
      localStorage.setItem(HINT_KEY, "1");
      setIosHint(false);
    },
  };
}

export function RegulInstallHint({ install, compact = false }: { install: RegulInstallState; compact?: boolean }) {
  if (!install.canInstall) return null;

  return (
    <button
      type="button"
      onClick={install.install}
      className={
        compact
          ? "h-11 rounded-full bg-slate-900 px-3 text-sm font-semibold text-white touch-manipulation active:bg-slate-700"
          : "mt-4 h-12 rounded-2xl bg-slate-900 px-4 text-base font-semibold text-white touch-manipulation active:bg-slate-700"
      }
    >
      Install
    </button>
  );
}

export function RegulIosHint({ install, className }: { install: RegulInstallState; className?: string }) {
  if (!install.iosHint) return null;

  return (
    <p className={className ?? "mt-4 max-w-[280px] text-center text-sm font-medium text-slate-600"}>
      {"Hors ligne, touchez Partager, puis Sur l'écran d'accueil. "}
      <button type="button" onClick={install.dismissIos} className="font-semibold text-slate-900 underline">
        OK
      </button>
    </p>
  );
}
