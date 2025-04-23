'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-extrabold text-gray-900">Phi Long Assignment</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboards"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Overview</span>
            </Link>
          </li>
          <li>
            <Link
              href="/research-assistant"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/research-assistant') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Research Assistant</span>
            </Link>
          </li>
          <li>
            <Link
              href="/research-reports"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/research-reports') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Research Reports</span>
            </Link>
          </li>
          <li>
            <Link
              href="/api-playground"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/api-playground') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">API Playground</span>
            </Link>
          </li>
          <li>
            <Link
              href="/invoices"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/invoices') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Invoices</span>
            </Link>
          </li>
          <li>
            <Link
              href="/documentation"
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/documentation') ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Documentation</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">BL</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Bui Le Phi Long</p>
          </div>
        </div>
      </div>
    </div>
  );
} 