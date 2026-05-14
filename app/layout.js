import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DealDrop",
  description:
    "Track product prices across e-commerce sites nad get alerts on price drops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <Toaster richColors />
      </body>
    </html>
  );
}
