"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, logOut } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="container mx-auto flex min-h-screen items-center py-2">
        <div className="mx-auto mt-24 overflow-y-hidden px-12 py-24 text-gray-600">
          <h2 className="mb-4 text-2xl font-semibold">You are logged in!</h2>

          <div className="mb-8 flex items-center justify-center">
            <button
              onClick={() => {
                logOut();
                router.push("/");
              }}
              className="rounded-md bg-green-600 px-10 py-3 text-white shadow-sm hover:bg-green-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
