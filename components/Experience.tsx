"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { TIMELINE } from "@/lib/timeline";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.55 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setSectionRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      sectionRefs.current[i] = el;
    },
    []
  );

  const jumpTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const active = TIMELINE[activeIndex];

  return (
    <div className="relative bg-[#04040A] text-[#F4F1EC]">
      <div className="fixed inset-0 z-0">
        <Scene activeIndex={activeIndex} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04040A]/40 via-transparent to-[#04040A]/70 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6">
        <span className="font-display font-bold text-base sm:text-lg tracking-tight">
          Cosmic Calendar
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[2px] opacity-50 hidden sm:block">
          13.8 Billion Years, One Scroll
        </span>
      </header>

      {/* Progress rail */}
      <div className="hidden lg:flex flex-col gap-1.5 fixed right-6 top-1/2 -translate-y-1/2 z-20">
        {TIMELINE.map((era, i) => (
          <button
            key={era.id}
            onClick={() => jumpTo(i)}
            aria-label={`Jump to ${era.title}`}
            className="group relative flex items-center justify-end"
          >
            <span className="pointer-events-none absolute right-5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black px-2 py-1 rounded">
              {era.title}
            </span>
            <span
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 8 : 5,
                height: i === activeIndex ? 8 : 5,
                background: i === activeIndex ? era.colors[0] : "rgba(255,255,255,0.25)",
              }}
            />
          </button>
        ))}
      </div>

      <main className="relative z-10">
        {/* Intro */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[3px] opacity-50 mb-4">
            18 events · 13.8 billion years
          </p>
          <h1 className="font-display font-extrabold text-[clamp(32px,7vw,76px)] leading-[1.03] max-w-[820px]">
            The whole history
            <br />
            of everything.
          </h1>
          <p className="mt-6 text-sm md:text-base opacity-60 max-w-[480px]">
            Scroll from the Big Bang to right now. Every date shown two ways:
            the real number, and where it falls if the universe's entire
            lifespan were compressed into a single year — a trick popularized
            by Carl Sagan to make deep time feel real.
          </p>
          <div className="mt-14 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] uppercase tracking-[3px]">Scroll</span>
            <div className="w-px h-10 bg-white/30" />
          </div>
        </section>

        {/* Era sections */}
        {TIMELINE.map((era, i) => {
          const alignRight = i % 2 === 1;
          return (
            <section
              key={era.id}
              ref={setSectionRef(i)}
              data-index={i}
              className="min-h-screen flex items-center px-6 md:px-16"
            >
              <div className={`w-full flex ${alignRight ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[460px] rounded-2xl backdrop-blur-md bg-black/40 border border-white/10 p-7 md:p-8 transition-opacity duration-500 ${
                    i === activeIndex ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                      style={{ background: era.colors[0], color: "#04040A" }}
                    >
                      {era.yearsAgo}
                    </span>
                    <span className="text-[11px] opacity-40 tabular-nums">
                      {String(i + 1).padStart(2, "0")} / {TIMELINE.length}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-[32px] leading-tight mb-1">
                    {era.title}
                  </h2>
                  <p className="text-sm font-semibold mb-4 opacity-70">{era.cosmicDate}</p>
                  <p className="text-[14px] md:text-[15px] leading-relaxed opacity-75">
                    {era.description}
                  </p>
                </div>
              </div>
            </section>
          );
        })}

        {/* Outro */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-display font-extrabold text-[clamp(28px,5vw,52px)] leading-tight max-w-[640px]">
            You're reading this in the last
            <br />
            <span className="opacity-50">second of the cosmic year.</span>
          </h2>
          <button
            onClick={() => jumpTo(0)}
            className="mt-10 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start over ↑
          </button>
          <p className="mt-10 text-xs opacity-30 max-w-[440px]">
            Dates follow the Cosmic Calendar popularized by Carl Sagan
            (The Dragons of Eden, 1977; Cosmos, 1980). Ages are the best
            current scientific estimates and get less precise the further
            back they go.
          </p>
        </section>
      </main>
    </div>
  );
}
