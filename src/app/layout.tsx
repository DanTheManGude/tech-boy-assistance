import type { Metadata } from "next";
import { AuthContextProvider } from "@/context/AuthContext";
import { DataContextProvider } from "@/context/DataContext";

import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Boy Assistance",
  description: "Request tech assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center">
          <h1 className="mb-4 mt-2 text-center text-2xl font-medium text-gray-900 dark:text-white sm:text-3xl sm:font-semibold">
            Tech Boy Assistance
          </h1>
        </div>
        <AuthContextProvider>
          <DataContextProvider>{children}</DataContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
