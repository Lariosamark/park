import { useState } from "react";
import { BellIcon } from "lucide-react";

export default function Notifications({ count }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="focus:outline-none">
        <BellIcon className="w-6 h-6 text-white" />
        {count > 0 && (
          <span className="absolute top-[-8px] right-[-12px] bg-red-500 text-white rounded-full text-xs px-1">
            {count}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-[-17rem] mt-2 w-[300px] h-[20rem] max-h-[20rem] overflow-y-auto bg-white shadow-lg rounded border-2">
          <div className="p-2">You have {count} notifications</div>
          {/* Example notification items */}
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
          <div className="p-2 border-b">Notification 1</div>
          <div className="p-2 border-b">Notification 2</div>
          <div className="p-2">Notification 3</div>
        </div>
      )}
    </div>
  );
}
