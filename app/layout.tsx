import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LangProvider } from "@/components/ugnay/lang";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ugnay — Every Need Verified, Every Peso Traced",
  description:
    "Ugnay connects donors, LGUs, and corporate sponsors to verified disaster-relief needs across Region 3. Every pledge is traced from donation to delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        publicSans.variable,
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a href="#main" className="ugnay-skip-link">
          Skip to content
        </a>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
