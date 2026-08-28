import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/react-query-provider";
import { SessionProvider } from "@/providers/SessionProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  title: "Flower_QT",
  description: "Hello , welcome to Flower_QT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.className} ${playfairDisplay.className}`}
      suppressHydrationWarning
    >
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <Providers>
            <SessionProvider>{children}</SessionProvider>
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
