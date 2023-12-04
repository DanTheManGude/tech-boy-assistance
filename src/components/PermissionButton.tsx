import { getDatabase, ref, update } from "firebase/database";

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

  const handleTokenButton = () => {
    getMessagingToken()
      .then((token) => {
        update(ref(getDatabase()), { "fcm-token": token }).catch((err) => {
          console.log("An error occurred while updating token.", err);
        });
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center mx-3 pt-3">
        <button
          onClick={requestPermission}
          className="w-full rounded-lg bg-yellow-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Request Notification Permission
        </button>
      </div>
      <div className="flex items-center justify-center mx-3 pt-3">
        <button
          onClick={handleTokenButton}
          className="w-full rounded-lg bg-yellow-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Get & Update FCM Token
        </button>
      </div>
    </>
  );
}
