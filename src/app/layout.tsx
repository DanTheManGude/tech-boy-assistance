import type { Metadata } from "next";
import { AuthContextProvider } from "@/context/AuthContext";
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
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
