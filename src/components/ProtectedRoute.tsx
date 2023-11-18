import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.uid) {
      router.push("/");
    }
  }, [router, user]);

  console.log(user);

  return <div>{user ? children : null}</div>;
};

export default ProtectedRoute;
