import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/react-query-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Flower_Web",
  description: "Hello , welcome to Flower_Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${playfairDisplay.className}`}
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}