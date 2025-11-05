import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider"; // ← іменований
import Header from "@/components/Header/Header"; // ← default export
import Footer from "@/components/Footer/Footer"; // ← default export
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider"; // ← правильно

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App | Auth",
  description: "Notes management with authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
