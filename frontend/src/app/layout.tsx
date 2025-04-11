import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sport Equipment Rental",
  description: "Rent sports equipment for your activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                  Sport Equipment Rental
                </Link>
                <nav className="flex space-x-4">
                  <Link href="/" className="hover:text-indigo-200 transition">
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="hover:text-indigo-200 transition"
                  >
                    Products
                  </Link>
                  <Link
                    href="/login"
                    className="hover:text-indigo-200 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="hover:text-indigo-200 transition"
                  >
                    Register
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p>
                  &copy; {new Date().getFullYear()} Sport Equipment Rental. All
                  rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
