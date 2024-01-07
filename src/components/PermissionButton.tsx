import { getDatabase, ref, update } from "firebase/database";

import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";

import { getMessagingToken } from "@/firebase.config";

const requestPermission = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      alert("Notification permission granted.");
    } else {
      console.log("Notification permission not granted.");
      alert("Notification permission not granted!");
    }
  });
};

export default function PermissionButton() {
  const { isAdmin } = useData();
  const { user } = useAuth();

  const handleTokenButton = () => {
    getMessagingToken()
      .then((token) => {
        if (isAdmin) {
          update(ref(getDatabase()), { "fcm-token": token })
            .then(() => {
              alert("Token recieved and saved.");
            })
            .catch((err) => {
              console.log("An error occurred while updating token.", err);
            });
        } else if (user) {
          update(ref(getDatabase()), {
            [`accounts/${user.uid}/fcm-token`]: token,
          })
            .then(() => {
              alert("Token recieved and saved.");
            })
            .catch((err) => {
              console.log("An error occurred while updating token.", err);
            });
        } else {
          console.log("No logged in user.");
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center mx-3">
        <div className="mr-1 w-half rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={requestPermission}
            className="w-full rounded-lg bg-yellow-600 px-5 py-3  text-center text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Ask Notification Permission
          </button>
        </div>
        <div className="ml-1 w-half rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={handleTokenButton}
            className="w-full rounded-lg bg-yellow-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Get & Update FCM Token
          </button>
        </div>
      </div>
    </>
  );
}
