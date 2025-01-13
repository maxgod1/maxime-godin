// app/banner.js
"use client";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";

export default function CookieBanner({ strings }: { strings: any }) {
  const posthog = usePostHog();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!(posthog.has_opted_in_capturing() || posthog.has_opted_out_capturing())) {
      setShowBanner(true);
    }
  }, [posthog]);

  if (!showBanner) {
    return null;
  }

  const acceptCookies = () => {
    posthog.opt_in_capturing();
    setShowBanner(false);
  };

  const declineCookies = () => {
    posthog.opt_out_capturing();
    setShowBanner(false);
  };

  return (
    <div className=" gap-5 fixed bottom-0 w-screen bg-white dark:bg-slate-600 bg-opacity-100 z-50 px-5 py-8 translate-x-100 animate-in flex justify-between items-center flex-wrap">
      <div>
        <p className="p-2">
          We use tracking cookies to understand how you use the product and help us improve it. Please accept cookies to
          help us improve.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="btn bg-slate-100 dark:bg-slate-700" onClick={declineCookies}>
          {strings["refuse-cookies"]}
        </button>
        <button className="btn bg-slate-300 dark:bg-slate-500" onClick={acceptCookies}>
          {strings["accept-cookies"]}
        </button>
      </div>
    </div>
  );
}
