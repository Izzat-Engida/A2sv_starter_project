import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

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
        <h1 className="text-9xl font-bold text-[#4F46E5] mb-4">{statusCode}</h1>
      )}
      <h2 className="text-4xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-xl text-gray-600 mb-8">{message}</p>
      {showHomeLink && (
        <Link
          href="/"
          className="px-6 py-3 bg-[#4F46E5] text-white font-medium rounded-lg hover:bg-[#4037ee] transition-colors duration-200"
        >
          Go home
        </Link>
      )}
    </div>
  );
}
