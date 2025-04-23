'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);
  
  // List of paths where we don't want to show the sidebar
  const noSidebarPaths = ['/', '/login', '/register', '/404'];
  const shouldShowSidebar = !noSidebarPaths.includes(pathname || '');

  if (!shouldShowSidebar) {
    return (
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {showSidebar && <Sidebar />}
        <div className={showSidebar ? "pl-64" : ""}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title={showSidebar ? "Hide Sidebar" : "Show Sidebar"}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showSidebar ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
