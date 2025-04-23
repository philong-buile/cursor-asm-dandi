'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = pathname?.startsWith('/dashboards');

  return (
    <html lang="en">
      <body className={inter.className}>
        {showSidebar && <Sidebar />}
        <div className={showSidebar ? "pl-64" : ""}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
