"use client";

import Tag from "@/components/Tag";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    question: "How do I get a ticket?",
    answer:
      "Create a free account, pick an upcoming draw, and generate your ticket. It's ready instantly — no payment or purchase required at any step.",
  },
  {
    question: "Is it really free to enter?",
    answer:
      "Yes. Every ticket on Spinworld is completely free. You'll never be asked to pay to enter a draw or to claim a prize.",
  },
  {
    question: "How are winners chosen?",
    answer:
      "Each draw is reviewed and winners are selected by our admin team once the draw closes. Results are posted on your dashboard and sent to your email the same day.",
  },
  {
    question: "How will I know if I've won?",
    answer:
      "You'll get an email notification as soon as winners are announced, and you can also check your ticket status anytime from your dashboard.",
  },
  {
    question: "Can I enter more than one draw?",
    answer:
      "Yes, you can generate a new ticket for each upcoming draw. There's no limit on how many draws you can take part in.",
  },
  {
    question: "Do I need to be present when winners are announced?",
    answer:
      "No. You don't need to do anything on draw day — if you win, we'll notify you directly and walk you through the next steps.",
  },
  {
    question: "Who can join Spinworld?",
    answer:
      "Spinworld is open to registered users worldwide, subject to your local laws around lottery participation. You just need a valid account to enter.",
  },
  {
    question: "Is my information kept secure?",
    answer:
      "Yes. Your account details are kept private and are only used to manage your entries and contact you about draws you've entered.",
  },
];

export default function Faqs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <section className="py-24 px-6">
      <div className="container">
        <div className="flex justify-center">
          <Tag>FAQs</Tag>
        </div>
        <h2 className="text-4xl md:text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
          Questions? We&apos;ve got{" "}
          <span className="text-lime-400">answers</span>
        </h2>
        <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
          {faqs.map((faq, faqIndex) => {
            return (
              <div
                key={faq.question}
                className="bg-neutral-900 rounded-2xl border border-white/10 p-6"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() => setSelectedIndex(faqIndex)}
                >
                  <h3 className="font-medium">{faq.question}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={twMerge(
                      "feather feather-plus text-lime-400 flex-shrink-0 transition duration-300",
                      selectedIndex === faqIndex && "rotate-45",
                    )}
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <AnimatePresence>
                  {selectedIndex === faqIndex && (
                    <motion.div
                      initial={{
                        height: 0,
                        marginTop: 0,
                      }}
                      animate={{
                        height: "auto",
                        marginTop: 24,
                      }}
                      exit={{
                        height: 0,
                        marginTop: 0,
                      }}
                      className={twMerge("overflow-hidden")}
                    >
                      <p className="text-white/50">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
