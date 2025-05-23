import type { Metadata } from "next";
import { ApolloProvider } from "@/components/providers/ApolloProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio App",
  description: "A portfolio application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
