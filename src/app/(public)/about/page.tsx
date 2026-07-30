import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Ticket,
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
  Trophy,
  CalendarCheck,
  Globe2,
} from "lucide-react";
import Tag from "@/components/Tag";
import Image from "next/image";

const values = [
  {
    icon: Ticket,
    title: "Free, always",
    desc: "Entering a free draw never costs anything — no card, no fees, no fine print.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent picks",
    desc: "Winners are selected openly and published on our Winners page for everyone to see.",
  },
  {
    icon: Sparkles,
    title: "Instant tickets",
    desc: "Generate a unique ticket the moment you enter — no waiting, no queues.",
  },
  {
    icon: Heart,
    title: "Built for players",
    desc: "Every part of Spinworld is designed to make entering and tracking draws effortless.",
  },
];

const stats = [
  { icon: Users, value: "25,000+", label: "Registered players" },
  { icon: Trophy, value: "$150,000", label: "Paid out in prizes" },
  { icon: CalendarCheck, value: "47", label: "Draws completed" },
  { icon: Globe2, value: "120+", label: "Countries represented" },
];

const steps = [
  {
    title: "A draw opens",
    desc: "Admins schedule a draw with a set date and prize. Most are free to enter, with one ticket per person.",
  },
  {
    title: "You get your ticket",
    desc: "Generate your ticket in seconds — it's yours the moment you claim it, no waiting on confirmation emails.",
  },
  {
    title: "The draw closes",
    desc: "Once the entry window ends, no more tickets are accepted for that round.",
  },
  {
    title: "Winners are announced",
    desc: "Winners are reviewed and picked, then published openly on our Winners page — nothing happens behind closed doors.",
  },
  {
    title: "Prizes land in your account",
    desc: "If you win, your prize is added straight to your account balance and we let you know right away.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Tag>About Spinworld</Tag>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              Spinworld is a simple, free way to enter lottery-style draws. Pick
              a draw, generate your ticket, and see the results — no payment, no
              hidden steps, no catch.
            </p>
          </div>

          {/* Right: image — stacks below the copy on mobile, sits beside it from lg up */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl"
            />
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 sm:aspect-[4/3]">
              <Image
                src="/images/about.jpg"
                alt="Spinworld players celebrating a draw win"
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/60 bg-card/30 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Tag>Why we built this</Tag>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Spinworld started from a pretty ordinary frustration: most free
              lottery sites were not actually free. There was always a catch — a
              card you had to add, a subscription buried in the terms, or
              winners you could never quite verify were real.
            </p>
            <p>
              We wanted something simpler. A place where entering a draw takes
              seconds, costs nothing, and where you can actually see who won and
              when. Nothing hidden, nothing to opt out of later.
            </p>
            <p>
              We are still a small team, and we are building this in the open —
              which means we are genuinely glad when players tell us what is
              confusing or what they wish worked differently. This site exists
              because people kept asking for something like it, so if something
              feels off, we would rather hear about it than have you quietly
              stop using it.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border/60 bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <Tag>What we stand for</Tag>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title}>
                <CardContent className="flex flex-col items-start gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-medium">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How draws work */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Tag>How draws work</Tag>
          <ol className="mt-10 space-y-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button render={<Link href="/dashboard" />}>
              Generate my ticket
            </Button>
            <Button variant="outline" render={<Link href="/draws" />}>
              View draws
            </Button>
          </div>
        </div>
      </section>

      {/* A note from the team */}
      <section className="border-t border-border/60 bg-card/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-lg text-muted-foreground">
            We built Spinworld because we wanted to enter a free draw ourselves,
            without wondering what the catch was. If you ever run into one here,
            tell us — we would genuinely rather fix it than have you wonder
            about it.
          </p>
          <p className="mt-4 text-sm font-medium">— The Spinworld Team</p>
        </div>
      </section>
    </div>
  );
}
