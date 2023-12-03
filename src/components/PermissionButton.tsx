import { useData } from "@/context/DataContext";
import { getMessagingToken } from "@/firebase.config";

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
    <>
      <div className="flex items-center justify-center mx-3 pt-3">
        <button
          onClick={requestPermission}
          className="w-full rounded-lg bg-orange-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Request Notification Permission
        </button>
      </div>
      <div className="flex items-center justify-center mx-3 pt-3">
        <button
          onClick={getMessagingToken}
          className="w-full rounded-lg bg-orange-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Get token
        </button>
      </div>
    </>
  );
}
