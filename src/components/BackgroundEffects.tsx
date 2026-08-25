"use client";

import React, { useEffect, useState } from "react";

export const BackgroundEffects: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Light Background Dot/Grid Pattern */}
      <div className="absolute inset-0 bg-light-grid opacity-60" />

      {/* Top Center Soft Purple/Indigo Radial Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-200/30 via-purple-100/20 to-transparent rounded-full blur-3xl opacity-70" />

      {/* Soft Blue Orb (Top Right) */}
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-sky-200/30 rounded-full blur-[120px]" />

      {/* Soft Purple Orb (Bottom Left) */}
      <div className="absolute bottom-20 -left-20 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px]" />

      {/* Subtle Floating Decorative Light Orbs */}
      {!reducedMotion && (
        <>
          <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-300/20 to-purple-300/30 blur-md animate-pulse" />
          <div className="absolute top-2/3 left-12 w-32 h-32 rounded-full bg-gradient-to-tr from-sky-300/20 to-indigo-300/20 blur-md" />
        </>
      )}
    </div>
  );
};
