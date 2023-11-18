import { child, getDatabase, push, ref, update } from "firebase/database";

import { useData, Message } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function FormAndButton() {
  const { isAdmin } = useData();
  const { user } = useAuth();
  const [reason, setReason] = useState("");

  if (isAdmin) {
    return null;
  }

  const handleClick = () => {
    if (!user) {
      console.error("No user when attempting to make request.");
      return;
    }

    const { uid, displayName } = user;

    const rootPath = `messages/${uid}`;
    const key = push(child(ref(getDatabase()), rootPath)).key;

    if (!key) {
      console.error("No key");
      return;
    }

    const message: Message = {
      fromName: displayName || uid,
      submittedTime: Date.now(),
      reason,
    };

    update(ref(getDatabase()), { [`${rootPath}/${key}`]: message })
      .catch(console.error)
      .finally(() => {
        setReason("");
      });
  };

  return (
    <div className="flex items-center justify-center mx-3 mt-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 py-6  shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6 sm:py-10 md:p-8 md:py-14">
        <p className="text-md mb-4 text-center text-gray-500 dark:text-gray-200">
          Please enter a reasoning to request tech assistance.
        </p>
        <div className="mb-5">
          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Reasoning
          </label>
          <input
            type="text"
            name="reason"
            id="reason"
            className="[&:not(:placeholder-shown):not(:focus):invalid~span]:block block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            autoComplete="off"
            required
            placeholder=""
            onChange={(event) => {
              setReason(event.target.value);
            }}
            value={reason}
          />
        </div>

        <button
          disabled={!Boolean(reason)}
          onClick={handleClick}
          className="mt-2 w-full rounded-lg bg-red-600 px-5 py-9 text-center text-lg font-bold text-gray-300 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 group-invalid:pointer-events-none group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:opacity-70"
        >
          Request Assistance
        </button>
      </div>
    </div>
  );
}
