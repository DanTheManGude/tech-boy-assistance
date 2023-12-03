import { useData } from "@/context/DataContext";

const requestPermission = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
};

export default function PermissionButton() {
  const { isAdmin } = useData();

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mx-3 pt-3">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={requestPermission}
          className="w-full rounded-lg bg-orange-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Request Notification Permission
        </button>
      </div>
    </div>
  );
}
