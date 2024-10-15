import { useState } from "react";
import { BellIcon } from "lucide-react";
import { useUser } from "../../providers/AuthProvider";
import { formatTimestamp } from "../../lib/globals";
import { deleteNotification, readNotification } from "../../lib/notification";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const { notifications } = useUser();

  // Filter notifications to get the count of unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => !notification.viewed
  );
  const unreadCount = unreadNotifications.length;

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="focus:outline-none">
        <BellIcon className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-[-8px] right-[-12px] bg-red-500 text-white rounded-full text-xs px-1">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-[-17rem] mt-2 w-[380px] h-[20rem] max-h-[20rem] overflow-y-auto bg-white shadow-lg rounded border-2">
          <div className="p-2 font-semibold">
            You have {notifications.length} notifications
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.fromId}
              className={`p-2 flex items-center ${
                !notification.viewed ? "font-bold" : ""
              }`}
            >
              {!notification.viewed && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              )}
              <div className="flex-1">
                <p>{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(notification.notifiedAt)}
                </span>
              </div>
              {!notification.viewed && (
                <button
                  className="text-blue-500 text-sm"
                  onClick={async () => await readNotification(notification.id)}
                >
                  Mark as Read
                </button>
              )}
              <button
                className="text-blue-500 text-sm"
                onClick={async () => await deleteNotification(notification.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
