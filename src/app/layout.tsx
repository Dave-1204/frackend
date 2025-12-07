import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Dave Aberos"
=======
  title: "Dave Gabriel Aberos"
>>>>>>> 20d3ae833bd875edf2e46d66b3b342495399b94f
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center`}
      >
        <html lang="en">
  <body className="min-h-screen bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
    {children}
  </body>
</html>
      </body>
    </html>
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
  );
}
