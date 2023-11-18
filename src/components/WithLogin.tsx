import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function WithLogin({ children }: { children: React.ReactNode }) {
  const { user, logOut = () => {}, logIn = () => {} } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(user && user.uid));
  }, [user]);

  const handleClick = async (e: any) => {
    e.preventDefault();
    try {
      if (isLoggedIn) {
        await logOut();
      } else {
        await logIn();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={handleClick}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      {isLoggedIn && children}
    </>
  );
}
