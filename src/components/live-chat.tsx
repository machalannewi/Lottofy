"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const EXCLUDED_PATHS = ["/admin", "/sign-in", "/sign-up"];

export function LiveChat() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
  const key = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;

  if (isExcluded || !key) return null;

  return (
    <Script id="smartsupp-widget" strategy="afterInteractive">
      {`
        var _smartsupp = _smartsupp || {};
        _smartsupp.key = '${key}';
        window.smartsupp || (function (d) {
          var s, c, o = smartsupp = function () { o._.push(arguments) };
          o._ = [];
          s = d.getElementsByTagName('script')[0];
          c = d.createElement('script');
          c.type = 'text/javascript';
          c.charset = 'utf-8';
          c.async = true;
          c.src = 'https://www.smartsuppchat.com/loader.js?';
          s.parentNode.insertBefore(c, s);
        })(document);
      `}
    </Script>
  );
}
