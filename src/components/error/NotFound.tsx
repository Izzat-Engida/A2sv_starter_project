// src/components/error/NotFound.tsx
"use client";

import Link from "next/link";

interface NotFoundProps {
  title?: string;
  statusCode?: number;
  message?: string;
  showHomeLink?: boolean;
}

export default function NotFound({
  title = "Page Not Found",
  statusCode = 404,
  message = "Sorry, we couldn't find the page you're looking for.",
  showHomeLink = true,
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-8">
      {statusCode && (
        <h1 className="text-9xl font-bold text-blue-700 mb-4">{statusCode}</h1>
      )}
      <h2 className="text-4xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-xl text-gray-600 mb-8">{message}</p>
      {showHomeLink && (
        <Link
          href="/"
          className="px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go home
        </Link>
      )}
    </div>
  );
}
