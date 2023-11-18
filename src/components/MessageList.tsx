import { useData, Message } from "@/context/DataContext";

export default function MessageList() {
  const { messages } = useData();

  const renderMessage = (message: Message) => {
    const { reason, submittedTime } = message;
    return (
      <div className="w-full my-2 rounded-lg border-4 border-green-400">
        <h1 className="ml-1">{reason}</h1>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center mx-3 pt-4">
      <div className="w-full max-w-sm">{messages.map(renderMessage)}</div>
    </div>
  );
}
