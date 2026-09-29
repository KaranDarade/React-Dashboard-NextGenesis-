import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const THEME_INIT = `try{var t=localStorage.getItem('ng_theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoreFlow — Product Management",
  description:
    "A premium product management dashboard for the DummyJSON catalogue.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <div className="ambient" aria-hidden>
          <div className="ambient-glow ambient-glow-a" />
          <div className="ambient-glow ambient-glow-b" />
          <div className="ambient-lines" />
        </div>
        {children}
      </body>
    </html>
  );
}
