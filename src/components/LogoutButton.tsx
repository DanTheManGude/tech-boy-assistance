import { useAuth } from "@/context/AuthContext";

const LoginButton = () => {
  // Use the signIn method from the AuthContext
  const { logOut } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await logOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Logout of your account
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
