"use client";

import Script from "next/script";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => unknown;
      };
    };
  }
}

export function GoogleTranslate() {
  return (
    <div className="flex items-center gap-1.5 [&_select]:h-8 [&_select]:rounded-md [&_select]:border [&_select]:border-border [&_select]:bg-background [&_select]:text-foreground [&_select]:text-xs [&_.goog-te-gadget]:text-foreground [&_.goog-te-gadget-simple]:bg-background [&_.goog-te-gadget-simple]:border-border [&_.goog-te-menu-value>span]:text-foreground">
      <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div id="google_translate_element" className="google-translate-widget" />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              { pageLanguage: "en", autoDisplay: false },
              "google_translate_element"
            );
          }
        `}
      </Script>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
