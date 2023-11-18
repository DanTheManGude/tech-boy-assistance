import { useAuth } from "@/context/AuthContext";

const LoginButton = () => {
  // Use the signIn method from the AuthContext
  const { logIn } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await logIn();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 py-8 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6 sm:py-10 md:p-8 md:py-14">
        <button
          onClick={handleLogin}
          className="mb-3 mt-2 w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 group-invalid:pointer-events-none group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:opacity-70"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
