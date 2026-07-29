"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Tag from "./Tag";

const testimonials = [
  {
    initials: "CD",
    name: "Camille Dubois.",
    location: "Monaco, France",
    quote:
      "Signing up took two minutes and my ticket was ready instantly. Love that it's completely free to enter.",
    tag: "Entered 3 draws so far",
  },
  {
    initials: "ME",
    name: "Marcus Ellery",
    location: "Illinois, USA",
    quote:
      "The dashboard makes it easy to see every draw I've entered and whether I won. Really clean experience.",
    tag: "Member since Draw #12",
  },
  {
    initials: "FA",
    name: "Fatima Al-Kuwari",
    location: "Doha, Qatar",
    quote:
      "I got the email the moment winners were announced. No hassle, no hidden fees — exactly what it promises.",
    tag: "Won in Draw #29",
  },
  {
    initials: "JR",
    name: "Jordan Reyes",
    location: "California, USA",
    quote:
      "Honestly I almost didn't sign up because I've been burned by 'free' sites before. This one actually is. My cousin thought I was joking when I told her.",
    tag: "Joined after a friend's recommendation",
  },
  {
    initials: "OW",
    name: "Oliver Whitfield",
    location: "London, UK",
    quote:
      "I check the site every Sunday morning with my coffee before anything else. It's become a nice little ritual, win or lose.",
    tag: "Entered 8 draws so far",
  },
  {
    initials: "EK",
    name: "Elin Karlsson",
    location: "Malmo, Sweden",
    quote:
      "Didn't win the first two draws, but the third one changed that. The email notification alone made my whole week.",
    tag: "Won in Draw #41",
  },
];

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive slides-per-view: 1 on mobile, 2 on tablet, 3 on desktop.
  useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) setPerView(3);
      else if (width >= 640) setPerView(2);
      else setPerView(1);
    };
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const pageCount = Math.max(1, testimonials.length - perView + 1);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % pageCount) + pageCount) % pageCount);
    },
    [pageCount],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay, paused on hover/focus.
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pageCount);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, pageCount]);

  const slideWidth = 100 / perView;

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-card/30 py-16">
      {/* soft warm glow in the background for a friendlier feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span>
            <Tag>Real players, real stories</Tag>
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-medium max-w-2xl mx-auto">
            What <span className="text-lime-400">players</span> are saying
          </h2>
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="overflow-hidden" ref={containerRef}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${index * slideWidth}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="shrink-0 px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5 text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <Quote className="h-5 w-5 text-primary/20" />
                      </div>

                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        &ldquo;{t.quote}&rdquo;
                      </p>

                      <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {t.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {t.location} · {t.tag}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonials"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-primary/20 hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonials"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
