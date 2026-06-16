"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INITIAL_DELAY = 650;
const NAVIGATION_DELAY = 460;

export default function GlobalLoading() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const hasMounted = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };

    clearHideTimer();
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      hasMounted.current = true;
    }, hasMounted.current ? NAVIGATION_DELAY : INITIAL_DELAY);

    return clearHideTimer;
  }, [pathname]);

  useEffect(() => {
    const showForInternalNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!target) return;

      const href = target.getAttribute("href");
      const anchorTarget = target.getAttribute("target");
      if (!href || href.startsWith("#") || anchorTarget === "_blank") return;

      const nextUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSameOrigin = nextUrl.origin === currentUrl.origin;
      const isSamePage =
        nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search;

      if (isSameOrigin && !isSamePage) {
        setVisible(true);
      }
    };

    document.addEventListener("click", showForInternalNavigation, true);

    return () => {
      document.removeEventListener("click", showForInternalNavigation, true);
    };
  }, []);

  return (
    <div
      className="gileara-loader gileara-loader--global"
      data-visible={visible}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
    >
      <div className="gileara-loader__mark" aria-hidden="true">
        <img src="/assets/gileara/logo-icon.png" alt="" />
      </div>
      <span className="sr-only">Loading Gileara</span>
    </div>
  );
}
