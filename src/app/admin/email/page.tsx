"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendBroadcastEmailAction } from "@/app/actions/admin";
import { Mail } from "lucide-react";

export default function AdminEmailPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [segment, setSegment] = useState<"all" | "active">("all");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await sendBroadcastEmailAction({ subject, message, segment });
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success(`Sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}.`);
        setSubject("");
        setMessage("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send broadcast.");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <Mail className="h-5 w-5 text-primary" />
        Broadcast email
      </h1>
      <p className="mt-1 text-muted-foreground">
        Send an update to all users or a segment.
      </p>

      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="segment">Recipients</Label>
              <Select value={segment} onValueChange={(v) => setSegment(v as "all" | "active")}>
                <SelectTrigger id="segment" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="active">Active users only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="This week's draw results are in!"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Write your update..."
                required
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send broadcast"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
