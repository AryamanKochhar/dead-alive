import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AudioControls from "@/components/game/AudioControls";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dead or Alive - The Game",
  description: "Were they alive when history happened?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster theme="dark" position="top-center" />
        <AudioControls />
      </body>
    </html>
  );
}
