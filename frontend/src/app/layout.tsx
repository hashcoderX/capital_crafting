import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CapitalCrafting Finance | Secure FinTech Investments",
  description:
    "CapitalCrafting is a modern fintech platform for secure savings, fixed deposits, and investment plans designed to grow your wealth.",
};

const ignoreExtensionNoiseScript = `
(function () {
  if (typeof window === 'undefined') return;
  var EXT_MSG = 'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received';
  window.addEventListener('unhandledrejection', function (event) {
    var reason = event && event.reason;
    var message = '';

    if (typeof reason === 'string') {
      message = reason;
    } else if (reason && typeof reason.message === 'string') {
      message = reason.message;
    }

    if (message.indexOf(EXT_MSG) !== -1) {
      event.preventDefault();
    }
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {process.env.NODE_ENV !== "production" && (
          <script dangerouslySetInnerHTML={{ __html: ignoreExtensionNoiseScript }} />
        )}
        {children}
      </body>
    </html>
  );
}
