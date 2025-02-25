import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lip/Provider";
import AuthProvider from "@/lip/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="font-mono">
          <StoreProvider>{children}</StoreProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
