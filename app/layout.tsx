import type { Metadata } from "next";

import { Poppins } from "next/font/google";

import "./styles/globals.css";

import Header from "./components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Matchita",
  description: "Just do it smarter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}
