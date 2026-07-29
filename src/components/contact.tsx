"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Clock, LocateIcon } from "lucide-react";
import Tag from "./Tag";

const contactPoints = [
  {
    id: "email",
    icon: Mail,
    label: "Email us",
    value: "support@lottofy.com",
  },
  {
    id: "response",
    icon: Clock,
    label: "Response time",
    value: "Usually within 24 hours",
  },
  {
    id: "help",
    icon: LocateIcon,
    label: "Address",
    value: "123, Beverly Hills, Philadelphia",
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Wire this up to your actual submit handler / API route.
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="border-t border-border/60 bg-card/30 py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Tag>Get in touch</Tag>
          <h2 className="text-4xl md:text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
            Questions about a <span className="text-lime-400">draw</span>, your{" "}
            <span className="text-lime-400">ticket</span>, or your{" "}
            <span className="text-lime-400">account</span>? We are happy to
            help.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {contactPoints.map(({ id, icon: Icon, label, value }) => (
              <Card key={id}>
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="truncate text-sm font-medium">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact form */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <p className="text-lg font-medium">Message sent</p>
                  <p className="text-sm text-muted-foreground">
                    Thanks for reaching out — we will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help"
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="self-start">
                    Send message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
