import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50 p-6">{children}</div>;
}
