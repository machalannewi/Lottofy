"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppFloatProps {
  /** Phone number in international format, digits only — e.g. "2348012345678" */
  phoneNumber: string;
  /** Pre-filled message opened in the chat */
  message?: string;
}

export function WhatsAppFloat({
  phoneNumber,
  message = "Hi! I have a question about Lottofy.",
}: WhatsAppFloatProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="hidden rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-md sm:block"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
      >
        {/* pulsing ring for attention */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />

        <svg
          viewBox="0 0 32 32"
          className="relative h-7 w-7 fill-current"
          aria-hidden="true"
        >
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.696 4.61 1.897 6.484L4 29l7.716-1.86A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.75c-1.958 0-3.783-.57-5.317-1.552l-.381-.242-4.583 1.104 1.223-4.464-.25-.393A9.71 9.71 0 0 1 5.25 15c0-5.937 4.813-10.75 10.751-10.75S26.75 9.063 26.75 15 21.938 24.75 16.001 24.75zm5.53-8.05c-.302-.152-1.789-.883-2.066-.984-.278-.101-.48-.152-.682.152-.202.303-.783.984-.96 1.187-.176.202-.353.227-.655.076-.302-.152-1.276-.47-2.431-1.501-.899-.802-1.506-1.792-1.682-2.095-.176-.303-.019-.467.133-.618.136-.135.302-.353.454-.53.151-.176.201-.303.302-.505.101-.202.05-.379-.025-.53-.076-.152-.682-1.646-.935-2.253-.246-.591-.497-.511-.682-.52-.176-.008-.378-.01-.58-.01-.202 0-.53.076-.807.379-.278.303-1.06 1.036-1.06 2.527s1.085 2.93 1.236 3.132c.151.202 2.135 3.259 5.174 4.57.723.312 1.287.499 1.727.638.726.231 1.386.198 1.908.12.582-.087 1.789-.732 2.041-1.438.252-.707.252-1.313.176-1.438-.075-.126-.277-.202-.579-.353z" />
        </svg>
      </motion.a>
    </div>
  );
}
