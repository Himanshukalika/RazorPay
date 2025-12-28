import type { Metadata } from "next";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

export const metadata: Metadata = {
  title: "Razorpay Payment Gateway - Secure Autopay",
  description: "Secure payment gateway with autopay functionality powered by Razorpay. Accept payments via credit card, debit card, UPI, net banking, and more.",
  keywords: ["razorpay", "payment gateway", "autopay", "recurring payments", "secure payments"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5f6fff" />
      </head>
      <body className="antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
